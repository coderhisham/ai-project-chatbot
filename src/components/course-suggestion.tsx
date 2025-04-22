"use client";

import { useState } from "react";
import { Course } from "./course-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, BookOpen, Layers, Lightbulb } from "lucide-react";

interface CourseSuggestionProps {
  courses: Course[];
  userQuery: string;
}

export function CourseSuggestion({
  courses,
  userQuery,
}: CourseSuggestionProps) {
  const [aiInsights, setAiInsights] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Generate AI insights about the recommended courses
  const generateInsights = async () => {
    if (isLoading || aiInsights) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courses,
          userQuery,
        }),
      });

      const data = await response.json();

      if (response.ok && data.insights) {
        setAiInsights(data.insights);
      } else {
        setAiInsights(
          "Sorry, I couldn't generate insights for these courses at the moment."
        );
      }
    } catch (error) {
      setAiInsights("An error occurred while generating insights.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-primary/10 hover:bg-primary/20 transition-all"
          onClick={generateInsights}
        >
          <Sparkles className="h-4 w-4" />
          AI Course Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Insights for Your Learning Journey
          </DialogTitle>
          <DialogDescription>
            Personalized analysis based on your interests and the recommended
            courses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                <div className="h-4 w-1/2 rounded bg-primary/20"></div>
                <div className="h-4 w-3/4 rounded bg-primary/20"></div>
                <div className="h-4 w-2/3 rounded bg-primary/20"></div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Generating insights...
              </p>
            </div>
          ) : (
            <>
              {aiInsights ? (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-card">
                    <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Learning Path Analysis
                    </h3>
                    <p className="text-sm">{aiInsights}</p>
                  </div>

                  <div className="rounded-lg border p-4 bg-card">
                    <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Skill Development
                    </h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {courses.slice(0, 3).map((course, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium">{course.title}:</span>{" "}
                          Perfect for {course.level.toLowerCase()} learners
                          looking to build skills in this area.
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>Click the button to generate AI insights</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
