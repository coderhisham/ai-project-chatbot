import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateCourseRecommendation(input: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a helpful course recommender. 
      Based on the user's interests, skills, and goals, recommend relevant courses.
      Format your response as a JSON array of courses with the following properties:
      - title: The name of the course
      - description: A brief description
      - level: Beginner, Intermediate, or Advanced
      - duration: Estimated time to complete (e.g., "8 weeks")
      - provider: The platform or institution offering the course
      
      The response should be a valid JSON array and nothing else. Do not include any explanation before or after the JSON array.
      
      User query: ${input}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Try to parse the response as JSON
    try {
      // First try direct JSON parsing
      try {
        return JSON.parse(text);
      } catch (directError) {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonRegex);

        if (match && match[1]) {
          const jsonString = match[1].trim();
          return JSON.parse(jsonString);
        }

        // Try to find JSON array pattern without using 's' flag
        const arrayStartIndex = text.indexOf("[");
        const arrayEndIndex = text.lastIndexOf("]");

        if (
          arrayStartIndex !== -1 &&
          arrayEndIndex !== -1 &&
          arrayStartIndex < arrayEndIndex
        ) {
          const jsonArrayString = text.substring(
            arrayStartIndex,
            arrayEndIndex + 1
          );
          return JSON.parse(jsonArrayString);
        }

        // If all extraction attempts fail
        throw new Error("Could not extract valid JSON from response");
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.error("Raw response:", text);
      return { error: "Failed to generate course recommendations" };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { error: "Failed to generate course recommendations" };
  }
}
