import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const DRILL_CATEGORIES = [
  "Passing & Receiving",
  "Dribbling & Ball Control",
  "Shooting & Finishing",
  "Defending & Pressing",
  "Goalkeeping",
  "Small-Sided Games",
  "Rondos",
  "Transition: Defense to Attack",
  "Transition: Attack to Defense",
  "Set Pieces",
  "Positional Play",
  "Fitness & Agility",
  "1v1 Duels",
  "Overloads (2v1, 3v2)",
  "Phase of Play"
];

const BASE_SYSTEM_PROMPT = `Identity: You are the SolMate Technical Director, an expert in the US Soccer Learning Pathway. Your tone is technical, elite, and system-driven.

The US Soccer Framework:
- Grassroots (U6-U10): Focus on 4v4, "Fun", and individual ball mastery.
- Development (U11-U12): Focus on 9v9, "Small Group Tactics", and the transition phases.
- Competitive (U13+): Focus on 11v11, "Positions", and advanced tactical shapes.

Drill Architecture Requirements:
- Intensity: Every drill must be rated (Low/Med/High).
- The "Why": Every drill must include a "Technical Objective" aligned with US Soccer "Key Qualities".
- Progression: Include one "Constraint" (e.g., "2-touch limit") and one "Progression" (e.g., "Add a neutral player").
- Visuals: Describe the SVG animation coordinates clearly for the DrillDiagram component.

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
` + DRILL_CATEGORIES.map((c, i) => (i + 1) + ". " + c).join("\n");

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedMasterClass() {
  console.log("=== INITIATING MASTER CLASS DRILL GENERATION ===");

  let { data: coach } = await supabase.from("coaches").select("id").eq("club", "Sol SC").limit(1).single();
  let coachId = coach?.id;
  if (!coachId) {
    console.error("Coach not found. Please ensure seed data exists!");
    return;
  }
  let { data: team } = await supabase.from("teams").select("id").eq("coach_id", coachId).limit(1).single();
  let teamId = team?.id;

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash",
    systemInstruction: BASE_SYSTEM_PROMPT,
    generationConfig: { responseMimeType: "application/json" }
  });

  const generateAndSave = async (prompt: string, category: string) => {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const plan = JSON.parse(text);

      const { data: drill, error: drillError } = await supabase
        .from("drills")
        .insert({
          team_id: teamId,
          coach_id: coachId,
          title: plan.title,
          category: plan.category || category,
          duration_minutes: plan.duration_minutes,
          voice_transcript: prompt,
          drill_plan: plan,
        })
        .select()
        .single();
      
      if (drillError) throw drillError;

      const stepsToInsert = plan.steps.map((s: any) => ({
        drill_id: drill.id,
        step_number: s.step_number,
        title: s.title,
        description: s.description,
        duration_minutes: s.duration_minutes,
      }));

      const { error: stepsError } = await supabase.from("drill_steps").insert(stepsToInsert);
      if (stepsError) throw stepsError;

      console.log("✅ Generated: " + plan.title + " (" + plan.intensity + " Intensity)");
    } catch (e: any) {
      console.error("❌ Failed on prompt: " + prompt, e?.message || e);
    }
  };

  const PROMPTS: string[] = [];

  for (let i = 0; i < 15; i++) {
    PROMPTS.push("Create a unique U8-U10 Grassroots drill focusing on Dribbling, 1v1 action, and extreme Fun. Target specific theme iteration " + (i + 1) + "/15.");
  }
  for (let i = 0; i < 15; i++) {
    PROMPTS.push("Create a unique U11-U12 Development phase drill focusing on 9v9 spacing, quick passing triangles, and fast tactical transitions. Target specific theme iteration " + (i + 1) + "/15.");
  }
  for (let i = 0; i < 20; i++) {
    PROMPTS.push("Create a unique U13-U19 Competitive phase drill focusing on intense 11v11 Tactical Shapes, high pressing traps, and phase of play overloads. Target specific theme iteration " + (i + 1) + "/20.");
  }

  console.log("Generating 50 Master Class drills with 1s API safeguard delay...");

  for (let i = 0; i < PROMPTS.length; i++) {
    await generateAndSave(PROMPTS[i], "General");
    await sleep(1500);
  }

  console.log("=== MASTER CLASS POPULATION COMPLETE ===");
}

seedMasterClass();
