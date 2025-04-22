import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface CourseDetailsRequest {
  title: string;
  description: string;
  level: string;
  provider: string;
}

export async function POST(req: NextRequest) {
  try {
    const courseData = (await req.json()) as CourseDetailsRequest;

    if (!courseData || !courseData.title) {
      return NextResponse.json(
        { error: "Course information is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Generate detailed information about the following course:
      
      Title: ${courseData.title}
      Description: ${courseData.description}
      Level: ${courseData.level}
      Provider: ${courseData.provider}
      
      Please provide a response in JSON format with the following fields:
      1. "whatYouWillLearn": An array of 4-5 specific skills or concepts students will gain from this course
      2. "prerequisites": An array of 2-3 recommended prerequisites for taking this course
      3. "keyTopics": An array of 4-5 key topics covered in the course
      4. "careerOpportunities": A brief paragraph about career opportunities related to this course
      5. "estimatedStudyTime": A realistic weekly study time estimate (e.g., "5-7 hours per week")
      
      Make sure your response is strictly in valid JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      // Try to parse JSON directly
      let jsonData = JSON.parse(text);
      return NextResponse.json(jsonData);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[0];
          let jsonData = JSON.parse(extractedJson);
          return NextResponse.json(jsonData);
        } catch (innerError) {
          console.error("Failed to parse extracted JSON:", innerError);
        }
      }

      console.error("Failed to parse AI response:", e);
      return NextResponse.json(
        { error: "Failed to generate course details" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in course details API route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
