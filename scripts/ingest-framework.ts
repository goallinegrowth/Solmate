import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Note: Anon key for script, adjust if you use service role
const supabase = createClient(supabaseUrl, supabaseKey);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a data extractor for US Soccer Frameworks.
Analyze the provided PDF which contains developmental pathways and coaching standards.
Extract the key qualities, tactical focus, and field size recommendations for EACH distinctive age group found in the document (e.g., U6-U8, U9-U10, U11-U12, U13-U19).

Respond strictly in JSON array format matching this schema:
[
  {
    "age_group": "string (e.g., 'U9-U10')",
    "key_qualities": "string - paragraph describing the main developmental physical, mental, and technical qualities",
    "tactical_focus": "string - paragraph describing attacking and defending focus",
    "field_size": "string - e.g., '7v7'"
  }
]`;

async function main() {
  try {
    const pdfPath = path.join(process.cwd(), "data", "us-soccer-player-development-framework-u9-u10-learning-plan.pdf");
    const buffer = fs.readFileSync(pdfPath);
    const base64Data = buffer.toString("base64");

    console.log("Analyzing US Soccer PDF with Gemini 3.1 Pro...");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent([
      "Extract the coaching standards from this US Soccer framework.",
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
    ]);

    const responseText = result.response.text();
    console.log("\nGemini Output:\n", responseText);

    const standards = JSON.parse(responseText);

    if (!Array.isArray(standards) || standards.length === 0) {
      console.log("No valid standards found or parsing failed.");
      return;
    }

    console.log("\nInserting into Supabase...");

    const { error } = await supabase
      .from("coaching_standards")
      .insert(standards);

    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      console.log(`Successfully ingested ${standards.length} age group standard(s) into database!`);
    }

  } catch (err) {
    console.error("Ingestion failed:", err);
  }
}

main();
