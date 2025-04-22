"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Copy } from "lucide-react";

interface SamplePromptProps {
  text: string;
  onClick: (text: string) => void;
}

function SamplePrompt({ text, onClick }: SamplePromptProps) {
  return (
    <button
      className="flex items-center justify-between w-full p-3 text-left text-sm rounded-lg border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
      onClick={() => onClick(text)}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>{text}</span>
      </div>
      <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 transition-opacity" />
    </button>
  );
}

export function HeroSection() {
  const handlePromptClick = (text: string) => {
    // Find the input element and set its value
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;

      if (nativeTextAreaValueSetter) {
        nativeTextAreaValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-8">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
        <GraduationCap className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2 max-w-lg">
        <h1 className="text-2xl font-bold">Pathzy</h1>
        <p className="text-muted-foreground">
          Ask me about courses you're interested in, and I'll help you find the
          best options tailored to your learning goals and experience level.
        </p>
      </div>

      <div className="w-full max-w-md space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Try asking about
        </p>
        <div className="grid gap-2">
          <SamplePrompt
            text="I want to learn web development with React"
            onClick={handlePromptClick}
          />
          <SamplePrompt
            text="What are some good machine learning courses for beginners?"
            onClick={handlePromptClick}
          />
          <SamplePrompt
            text="I need a course on UI/UX design that's advanced level"
            onClick={handlePromptClick}
          />
          <SamplePrompt
            text="Find me courses about data science with Python"
            onClick={handlePromptClick}
          />
        </div>
      </div>
    </div>
  );
}
