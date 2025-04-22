import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { courses, userQuery } = await req.json();

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { error: "Valid courses are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Format the course information for the prompt
    const courseInfo = courses
      .map((course, index) => {
        return `Course ${index + 1}: ${course.title} (${course.level})
      Description: ${course.description}
      Provider: ${course.provider}
      Duration: ${course.duration}`;
      })
      .join("\n\n");

    const prompt = `
      As an AI course advisor, analyze the following courses that were recommended based on the user's query: "${userQuery}".
      
      ${courseInfo}
      
      Provide a 4-5 sentence personalized learning path analysis for the user. Consider:
      1. How these courses complement each other
      2. The progression of skills from basic to advanced
      3. The relevance to the user's original query
      4. Long-term career or skill development potential
      
      Make your response conversational, encouraging, and specific to the courses listed. 
      Do not include any preamble or introduction like "Based on the courses..." or "Looking at these courses...".
      Just directly provide the analysis in a concise, helpful paragraph.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const insights = response.text().trim();

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error in insights API route:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
