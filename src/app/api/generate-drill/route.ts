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
  intensity: "Low" | "Med" | "High";
  technical_objective: string;
  constraint: string;
  progression: string;
  animation_coordinates: string;
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

const BASE_SYSTEM_PROMPT = `Identity: You are the SolMate Technical Director, an expert in the US Soccer Learning Pathway. Your tone is technical, elite, and system-driven.

The US Soccer Framework:
- Grassroots (U6-U10): Focus on 4v4, "Fun", and individual ball mastery.
- Development (U11-U12): Focus on 9v9, "Small Group Tactics", and the transition phases.
- Competitive (U13+): Focus on 11v11, "Positions", and advanced tactical shapes.

Drill Architecture Requirements:
- Intensity: Every drill must be rated (Low/Med/High).
- The "Why": Every drill must include a "Technical Objective" aligned with US Soccer "Key Qualities".
- Progression: Include one "Constraint" (e.g., "2-touch limit") and one "Progression" (e.g., "Add a neutral player").
- Visuals: Describe the SVG animation coordinates clearly for the <DrillDiagram /> component.

Strict Output: Return a JSON object only. No conversational filler. Ensure the field dimensions and player counts strictly match the age group provided.

The JSON must match this exact schema:
{
  "title": "string — a concise, descriptive drill title",
  "category": "string — MUST be one of the categories listed below",
  "duration_minutes": number — total drill duration in minutes,
  "intensity": "string — Low, Med, or High",
  "technical_objective": "string — the 'Why' aligned with US Soccer",
  "constraint": "string — e.g. 2-touch limit",
  "progression": "string — e.g. Add a neutral player",
  "animation_coordinates": "string — describe SVG coordinates for <DrillDiagram />",
  "steps": [
    {
      "step_number": number — starting at 1,
      "title": "string — short step title",
      "description": "string — detailed coaching instructions, field dimensions, and player counts.",
      "duration_minutes": number — duration for this step
    }
  ]
}

VALID CATEGORIES (you must pick exactly one):
${DRILL_CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;

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

    // ----- Apply The Prime Directive -----
    // Fetch team age group to dictate the standard
    const { data: teamData } = await supabase.from("teams").select("age_group").eq("id", teamId).single();
    let targetAgeGroup = teamData?.age_group;
    if (!targetAgeGroup) {
      targetAgeGroup = "U11-U12";
      console.log(`Team missing age group. Defaulting to \${targetAgeGroup} standard.`);
    }

    const { data: standardData } = await supabase.from("coaching_standards").select("*").eq("age_group", targetAgeGroup).limit(1).single();
    
    let injectedPrompt = BASE_SYSTEM_PROMPT;
    if (standardData) {
      console.log(`Applying US Soccer Brain-Lift directive for \${targetAgeGroup}`);
      injectedPrompt += `\n\nTHE PRIME DIRECTIVE:
You are now a US Soccer Certified Technical Director. Before generating any drill, check these standards to ensure the tactical focus and field size match the US Soccer developmental pathway for the \${targetAgeGroup} level:
- Key Qualities: \${standardData.key_qualities}
- Tactical Focus: \${standardData.tactical_focus}
- Recommended Field Size: \${standardData.field_size || "Standard"}

The drill you output MUST respect this developmental framework.`;
    } else {
      console.log(`No explicit coaching standard found for \${targetAgeGroup}, proceeding with default AI defaults.`);
    }

    // ----- Call Gemini to generate drill plan -----
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: injectedPrompt,
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
