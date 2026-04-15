import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { DRILL_CATEGORIES } from "@/lib/categories";

const SYSTEM_PROMPT = `You are SolMate, an expert AI coaching assistant for Sol Sports Club.
You are analyzing a PDF document containing a soccer drill, practice plan, or session guide.
Extract the core details and turn it into a structured drill plan. If the PDF contains multiple drills, extract the primary one or summarize the session as a single progression.

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
      "description": "string — detailed coaching instructions, layout, and rules for this step",
      "duration_minutes": number — duration for this step
    }
  ]
}

VALID CATEGORIES (you must pick exactly one):
\${DRILL_CATEGORIES.map((c, i) => \`\${i + 1}. \${c}\`).join("\\n")}
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const coachId = formData.get("coach_id") as string | null;
    const teamId = formData.get("team_id") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Missing 'pdf' file." }, { status: 400 });
    }

    if (!coachId || !teamId) {
      return NextResponse.json({ error: "Missing coach_id or team_id." }, { status: 400 });
    }

    // Convert PDF to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent([
      "Extract the drill details from this PDF.",
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
    ]);

    const responseText = result.response.text();
    console.log("=== API IMPORT PDF: GEMINI RESPONSE ===");
    console.log(responseText);

    if (!responseText) {
      return NextResponse.json({ error: "No response from AI." }, { status: 502 });
    }

    let drillPlan;
    try {
      drillPlan = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON.", raw: responseText }, { status: 502 });
    }

    // fallback category validation
    const validCategories: readonly string[] = DRILL_CATEGORIES;
    if (!validCategories.includes(drillPlan.category)) {
       const lowerCategory = drillPlan.category.toLowerCase();
       const match = DRILL_CATEGORIES.find((c) => c.toLowerCase().includes(lowerCategory));
       drillPlan.category = match || DRILL_CATEGORIES[0];
    }

    const supabase = createClient();
    
    // Save to DB
    const { data: drill, error: drillError } = await supabase
      .from("drills")
      .insert({
        team_id: teamId,
        coach_id: coachId,
        title: drillPlan.title,
        category: drillPlan.category,
        duration_minutes: drillPlan.duration_minutes,
        voice_transcript: `PDF Import: \${file.name}`,
        drill_plan: drillPlan,
      })
      .select()
      .single();

    if (drillError) {
      return NextResponse.json({ error: "Failed to save drill.", details: drillError.message }, { status: 500 });
    }

    interface GeneratedStep {
      step_number: number;
      title: string;
      description: string;
      duration_minutes: number;
    }

    const stepsToInsert = drillPlan.steps.map((step: GeneratedStep) => ({
      drill_id: drill.id,
      step_number: step.step_number,
      title: step.title,
      description: step.description,
      duration_minutes: step.duration_minutes,
    }));

    const { error: stepsError } = await supabase.from("drill_steps").insert(stepsToInsert);

    if (stepsError) {
       return NextResponse.json({ warning: "Drill saved but steps failed.", drill_id: drill.id, drill_plan: drillPlan }, { status: 207 });
    }

    return NextResponse.json({ success: true, drill_id: drill.id, drill_plan: drillPlan }, { status: 201 });

  } catch (error) {
    console.error("PDF Import error:", error);
    return NextResponse.json({ error: "Internal error", details: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
  }
}
