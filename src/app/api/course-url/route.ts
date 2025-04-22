import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface CourseUrlRequest {
  title: string;
  provider: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, provider } = body as CourseUrlRequest;

    if (!title || !provider) {
      return NextResponse.json(
        { error: "Title and provider are required" },
        { status: 400 }
      );
    }

    // Generate a fallback URL in case AI generation fails
    const fallbackUrl = generateFallbackUrl(title, provider);

    try {
      // Use Gemini to generate a realistic URL
      const generatedUrl = await generateUrlWithGemini(title, provider);

      return NextResponse.json({ url: generatedUrl || fallbackUrl });
    } catch (aiError) {
      console.error("Gemini URL generation failed:", aiError);
      // Return fallback URL if AI generation fails
      return NextResponse.json({ url: fallbackUrl });
    }
  } catch (error) {
    console.error("Course URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate course URL" },
      { status: 500 }
    );
  }
}

async function generateUrlWithGemini(
  title: string,
  provider: string
): Promise<string> {
  // For safety, we set the safety settings to block none
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  // Get the Gemini generative model
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    safetySettings,
  });

  const prompt = `Generate a realistic URL for a course titled "${title}" offered by "${provider}". 
The URL should follow the provider's URL structure and include appropriate paths, slugs, and query parameters.
Return ONLY the full URL with no additional text, explanations, or code formatting.`;

  // Generate content using Gemini
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const generatedUrl = response.text().trim();

  // Validate URL
  if (generatedUrl && isValidUrl(generatedUrl)) {
    return generatedUrl;
  } else {
    throw new Error("Generated URL is invalid");
  }
}

function generateFallbackUrl(title: string, provider: string): string {
  // Create a clean slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 60);

  // Add a random course ID to make URLs more realistic
  const courseId = Math.floor(10000000 + Math.random() * 90000000);

  switch (provider.toLowerCase()) {
    case "udemy":
      return `https://www.udemy.com/course/${slug}/?utm_source=recommender`;
    case "coursera":
      return `https://www.coursera.org/learn/${slug}?specialization=recommended`;
    case "edx":
      return `https://www.edx.org/learn/${slug}`;
    case "linkedin learning":
    case "linkedin":
      return `https://www.linkedin.com/learning/courses/${slug}-${courseId}`;
    case "pluralsight":
      return `https://app.pluralsight.com/library/courses/${slug}/table-of-contents`;
    default:
      // Handle other providers with a generic format
      const providerDomain = provider
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^\w-]/g, "");
      return `https://www.${providerDomain}.com/courses/${slug}`;
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}
