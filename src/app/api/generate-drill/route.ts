import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { DRILL_CATEGORIES } from "@/lib/categories";

// ============================================
// Types for the structured AI response
// ============================================

interface GeneratedStep {
  step_number: number;
  title: string;
  description: string;
  duration_minutes: number;
}

interface GeneratedDrill {
  title: string;
  category: string;
  duration_minutes: number;
  steps: GeneratedStep[];
}

// ============================================
// Request body
// ============================================

interface GenerateDrillRequest {
  voice_transcript: string;
  team_id: string;
  coach_id: string;
}

// ============================================
// System prompt for Claude
// ============================================

const SYSTEM_PROMPT = `You are SolMate, an expert AI coaching assistant for Sol Sports Club, a youth soccer academy in Central Florida.

Your job is to take a coach's voice transcript — their raw spoken description of what they want to work on — and turn it into a professional, structured drill plan.

You MUST respond with valid JSON only. No markdown, no explanation, no wrapping. Just the raw JSON object.

The JSON must match this exact schema:
{
  "title": "string — a concise, descriptive drill title",
  "category": "string — MUST be one of the categories listed below",
  "duration_minutes": number — total drill duration in minutes,
  "steps": [
    {
      "step_number": number — starting at 1,
      "title": "string — short step title",
      "description": "string — detailed coaching instructions for this step, including player positioning, equipment needed, and coaching cues",
      "duration_minutes": number — duration for this step
    }
  ]
}

VALID CATEGORIES (you must pick exactly one):
${DRILL_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}

RULES:
- Always include 3–8 steps depending on complexity.
- Step durations must sum to the total duration_minutes.
- Include warm-up and cool-down steps when appropriate.
- Use age-appropriate language and drills for youth soccer (ages 6–18).
- Be specific with coaching cues: "plant foot beside the ball" not "kick it properly".
- If the transcript is vague, infer reasonable defaults and make the drill practical.`;

// ============================================
// POST /api/generate-drill
// ============================================

export async function POST(request: NextRequest) {
  try {
    // ----- Parse & validate request body -----
    const body: GenerateDrillRequest = await request.json();

    if (!body.voice_transcript?.trim()) {
      return NextResponse.json(
        { error: "voice_transcript is required." },
        { status: 400 }
      );
    }

    console.log("=== API GENERATE DRILL: REQUEST BODY ===");
    console.log(JSON.stringify(body, null, 2));

    const supabase = createClient();

    let coachId = body.coach_id?.trim();
    let teamId = body.team_id?.trim();

    if (!coachId || !teamId) {
      console.log("Missing coach_id or team_id. Using default Sol SC coach/team.");
      // Fetch or create default coach
      let { data: coach } = await supabase.from("coaches").select("id").eq("club", "Sol SC").limit(1).single();
      if (!coach) {
        const { data: newCoach } = await supabase.from("coaches").insert({ name: "Default Coach", email: "default@solmate.com", club: "Sol SC" }).select("id").single();
        coach = newCoach;
      }
      coachId = coach!.id;

      // Fetch or create default team
      let { data: team } = await supabase.from("teams").select("id").eq("coach_id", coachId).limit(1).single();
      if (!team) {
        const { data: newTeam } = await supabase.from("teams").insert({ name: "Default Team", age_group: "U12", league: "Sol SC League", coach_id: coachId }).select("id").single();
        team = newTeam;
      }
      teamId = team!.id;
    }

    // ----- Call Gemini to generate drill plan -----
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(`Here is the coach's voice transcript. Turn it into a structured drill plan:\n\n"${body.voice_transcript}"`);
    const responseText = result.response.text();
    
    console.log("=== API GENERATE DRILL: GEMINI RESPONSE ===");
    console.log(responseText);

    if (!responseText) {
      return NextResponse.json(
        { error: "No text response received from AI." },
        { status: 502 }
      );
    }

    // Parse the JSON response
    let drillPlan: GeneratedDrill;
    try {
      drillPlan = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON.",
          raw_response: responseText,
        },
        { status: 502 }
      );
    }

    // Validate that the category is one of our 15
    const validCategories: readonly string[] = DRILL_CATEGORIES;
    if (!validCategories.includes(drillPlan.category)) {
      // If Claude picked something close but not exact, find the closest match
      const lowerCategory = drillPlan.category.toLowerCase();
      const match = DRILL_CATEGORIES.find((c) =>
        c.toLowerCase().includes(lowerCategory) ||
        lowerCategory.includes(c.toLowerCase())
      );
      if (match) {
        drillPlan.category = match;
      } else {
        drillPlan.category = DRILL_CATEGORIES[0]; // fallback
      }
    }

    // ----- Save drill to Supabase -----

    // Insert the drill
    const { data: drill, error: drillError } = await supabase
      .from("drills")
      .insert({
        team_id: teamId,
        coach_id: coachId,
        title: drillPlan.title,
        category: drillPlan.category,
        duration_minutes: drillPlan.duration_minutes,
        voice_transcript: body.voice_transcript,
        drill_plan: drillPlan as unknown as Record<string, unknown>,
      })
      .select()
      .single();

    if (drillError) {
      console.error("Supabase drill insert error:", drillError);
      return NextResponse.json(
        { error: "Failed to save drill.", details: drillError.message },
        { status: 500 }
      );
    }

    // Insert drill steps
    const stepsToInsert = drillPlan.steps.map((step) => ({
      drill_id: drill.id,
      step_number: step.step_number,
      title: step.title,
      description: step.description,
      duration_minutes: step.duration_minutes,
    }));

    const { error: stepsError } = await supabase
      .from("drill_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      console.error("Supabase drill_steps insert error:", stepsError);
      // Drill was saved but steps failed — return partial success
      return NextResponse.json(
        {
          warning: "Drill saved but steps failed to save.",
          drill,
          drill_plan: drillPlan,
          steps_error: stepsError.message,
        },
        { status: 207 }
      );
    }

    // ----- Return success -----
    return NextResponse.json(
      {
        success: true,
        drill_id: drill.id,
        drill,
        drill_plan: drillPlan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Generate drill error:", error);
    return NextResponse.json(
      {
        error: "Internal server error.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
