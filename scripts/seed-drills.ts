import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_DRILLS = [
  {
    title: "U10 4v4 Build Out Line Focus",
    category: "Small-Sided Games",
    duration_minutes: 20,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U10 4v4 Build Out Line Focus",
      category: "Small-Sided Games",
      duration_minutes: 20,
      steps: [
        {
          step_number: 1,
          title: "Setup & Rules",
          description: "4v4 game on a 35x25 field. The attacking team must build out of the back when the keeper has the ball. Defenders must retreat behind the build-out line.",
          duration_minutes: 5
        },
        {
          step_number: 2,
          title: "Live Play",
          description: "Focus on the goalkeeper rolling the ball to the center backs. Center backs look to break the first line of pressure immediately.",
          duration_minutes: 15
        }
      ]
    }
  },
  {
    title: "U12 1v1 Attacking Repetitions",
    category: "Dribbling & Ball Control",
    duration_minutes: 15,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U12 1v1 Attacking Repetitions",
      category: "Dribbling & Ball Control",
      duration_minutes: 15,
      steps: [
        {
          step_number: 1,
          title: "Channel Setup",
          description: "15x10 yard channels. Attacker starts with the ball at one end, defender starts opposite. Attacker tries to dribble across the end line.",
          duration_minutes: 5
        },
        {
          step_number: 2,
          title: "Progression: Transition",
          description: "If the defender wins the ball, they immediately counter-attack to the attacker's starting line.",
          duration_minutes: 10
        }
      ]
    }
  },
  {
    title: "U14 Transition Rondo (4v2 to 6v4)",
    category: "Transition: Defense to Attack",
    duration_minutes: 25,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U14 Transition Rondo (4v2 to 6v4)",
      category: "Transition: Defense to Attack",
      duration_minutes: 25,
      steps: [
        {
          step_number: 1,
          title: "4v2 Possession",
          description: "Play 4v2 in a 12x12 grid. 5 consecutive passes equals a point for the outside players.",
          duration_minutes: 10
        },
        {
          step_number: 2,
          title: "Transition Moment",
          description: "When defenders win the ball, they look to quickly play to 2 target players waiting outside the grid, expanding the game to a 6v4.",
          duration_minutes: 15
        }
      ]
    }
  },
  {
    title: "U16 High Press Triggers",
    category: "Defending & Pressing",
    duration_minutes: 30,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U16 High Press Triggers",
      category: "Defending & Pressing",
      duration_minutes: 30,
      steps: [
        {
          step_number: 1,
          title: "Phase Setup",
          description: "Set up the attacking team (blue) building out of the back 4 + GK against a pressing front 3 + 2 midfielders (red).",
          duration_minutes: 10
        },
        {
          step_number: 2,
          title: "Trigger Recognition",
          description: "Red team stays compact. The trigger to press is a slow, bouncing pass to the full-back, or a backwards pass to the goalkeeper.",
          duration_minutes: 20
        }
      ]
    }
  },
  {
    title: "U12 First Touch Under Pressure",
    category: "Passing & Receiving",
    duration_minutes: 15,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U12 First Touch Under Pressure",
      category: "Passing & Receiving",
      duration_minutes: 15,
      steps: [
        {
          step_number: 1,
          title: "Y-Passing Pattern",
          description: "Players follow a Y-shaped passing pattern. The receiver must take their first touch away from the cone (simulated defender).",
          duration_minutes: 15
        }
      ]
    }
  },
  {
    title: "U18 Final Third Finishing",
    category: "Shooting & Finishing",
    duration_minutes: 20,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U18 Final Third Finishing",
      category: "Shooting & Finishing",
      duration_minutes: 20,
      steps: [
        {
          step_number: 1,
          title: "Combination & Strike",
          description: "Player A plays into the striker (Player B). Player B sets the ball back for Player A to strike first-time from the top of the box.",
          duration_minutes: 10
        },
        {
          step_number: 2,
          title: "Live 2v1 Finish",
          description: "After the first shot, the coach feeds a second ball for a live 2v1 quickly transitioning to goal.",
          duration_minutes: 10
        }
      ]
    }
  },
  {
    title: "U10 Fundamental GK Handling",
    category: "Goalkeeping",
    duration_minutes: 15,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U10 Fundamental GK Handling",
      category: "Goalkeeping",
      duration_minutes: 15,
      steps: [
        {
          step_number: 1,
          title: "W-Catch Reps",
          description: "Coach volleys balls directly at the GK from 6 yards out. Focus on the W-contour hand shape and securing the ball to the chest.",
          duration_minutes: 15
        }
      ]
    }
  },
  {
    title: "U15 Attacking Corner Kicks",
    category: "Set Pieces",
    duration_minutes: 25,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U15 Attacking Corner Kicks",
      category: "Set Pieces",
      duration_minutes: 25,
      steps: [
        {
          step_number: 1,
          title: "Run Timing",
          description: "Shadow play without defenders. Three players make synchronized runs (near post, back post, penalty spot) as the taker delivers an outswinger.",
          duration_minutes: 10
        },
        {
          step_number: 2,
          title: "Live Defense",
          description: "Add 5 defenders. The attacking team must execute the set piece against live spatial pressure.",
          duration_minutes: 15
        }
      ]
    }
  },
  {
    title: "U14 Midfield Triangle Rotation",
    category: "Positional Play",
    duration_minutes: 20,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U14 Midfield Triangle Rotation",
      category: "Positional Play",
      duration_minutes: 20,
      steps: [
        {
          step_number: 1,
          title: "3v3 in the Core",
          description: "3 midfielders play against 3 defenders. The attackers must rotate positions (6, 8, 10) fluidly to receive the ball from the coach.",
          duration_minutes: 20
        }
      ]
    }
  },
  {
    title: "U8 Fun Pirate Dribbling",
    category: "Dribbling & Ball Control",
    duration_minutes: 10,
    voice_transcript: "Seed Data",
    drill_plan: {
      title: "U8 Fun Pirate Dribbling",
      category: "Dribbling & Ball Control",
      duration_minutes: 10,
      steps: [
        {
          step_number: 1,
          title: "Protect the Treasure",
          description: "Every player has a ball (treasure). Two coaches are the 'pirates'. Players must dribble and shield their balls within the 20x20 grid to avoid the pirates.",
          duration_minutes: 10
        }
      ]
    }
  }
];

async function seedDrills() {
  console.log("Seeding Drills Library...");

  // 1. Get default Coach / Team (like in generate-drill logic)
  let coachId;
  let teamId;

  // Find default coach
  let { data: coach } = await supabase.from("coaches").select("id").eq("club", "Sol SC").limit(1).single();
  if (coach) {
    coachId = coach.id;
  } else {
    // If not found, skip entirely or just dump directly (though DB schema may fail FK constraints)
    console.error("Coach 'Sol SC' not found. Please ensure the DB has default team data populated first!");
    return;
  }

  // Find default team
  let { data: team } = await supabase.from("teams").select("id").eq("coach_id", coachId).limit(1).single();
  if (team) {
    teamId = team.id;
  } else {
    console.error("No team found for default coach.");
    return;
  }

  // 2. Loop through and insert
  for (const drillInfo of SEED_DRILLS) {
    console.log(`Inserting: ${drillInfo.title}`);

    // Insert Drills
    const { data: drillRecord, error: drillError } = await supabase
      .from("drills")
      .insert({
        team_id: teamId,
        coach_id: coachId,
        title: drillInfo.title,
        category: drillInfo.category, // e.g. "Small-Sided Games"
        duration_minutes: drillInfo.duration_minutes,
        voice_transcript: drillInfo.voice_transcript,
        drill_plan: drillInfo.drill_plan,
      })
      .select()
      .single();

    if (drillError) {
      console.error(`Error inserting ${drillInfo.title}:`, drillError.message);
      continue;
    }

    // Insert drill steps
    const stepsToInsert = drillInfo.drill_plan.steps.map((s) => ({
      drill_id: drillRecord.id,
      step_number: s.step_number,
      title: s.title,
      description: s.description,
      duration_minutes: s.duration_minutes,
    }));

    const { error: stepsError } = await supabase.from("drill_steps").insert(stepsToInsert);
    if (stepsError) {
      console.error(`Error inserting steps for ${drillInfo.title}:`, stepsError.message);
    }
  }

  console.log("\\nSeed process complete! Check your /library UI!");
}

seedDrills();
