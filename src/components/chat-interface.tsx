"use client";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Course } from "@/components/course-card";
import { Message, ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { CourseList } from "@/components/course-list";
import { HeroSection } from "@/components/hero-section";
import { BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface for course recommendation sets
interface CourseRecommendation {
  id: string;
  query: string;
  courses: Course[];
  timestamp: number;
}

// List of generic terms to decline
const GENERIC_TERMS = [
  "hello",
  "hi",
  "hey",
  "test",
  "sample",
  "example",
  "good morning",
  "good afternoon",
  "good evening",
  "what's up",
  "how are you",
  "help",
  "ping",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I can help you find courses based on your interests. What would you like to learn?",
    },
  ]);
  const [courseRecommendations, setCourseRecommendations] = useState<
    CourseRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [showHero, setShowHero] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check if the input is a generic greeting or sample prompt
  const isGenericPrompt = (input: string): boolean => {
    const lowercasedInput = input.toLowerCase().trim();

    // Check exact matches
    if (GENERIC_TERMS.includes(lowercasedInput)) {
      return true;
    }

    // Check if the input starts with any of the generic terms
    for (const term of GENERIC_TERMS) {
      if (lowercasedInput.startsWith(term)) {
        return true;
      }
    }

    // Check for very short inputs (less than 3 words)
    const wordCount = lowercasedInput.split(/\s+/).filter(Boolean).length;
    if (wordCount < 3 && lowercasedInput.length < 15) {
      return true;
    }

    return false;
  };

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // Set the current query for AI insights
    setUserQuery(content);

    // Hide hero section when user starts chatting
    if (showHero) {
      setShowHero(false);
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check if the message is a generic prompt
    if (isGenericPrompt(content)) {
      const declineMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content:
          "I'm specifically designed to recommend courses based on your learning interests. Could you please tell me what subject or skills you're interested in learning? For example: 'I want to learn web development' or 'I'm looking for courses on artificial intelligence'.",
      };
      setMessages((prev) => [...prev, declineMessage]);
      return;
    }

    // Show loading
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if there's an error in the response
        if (data.courses && data.courses.error) {
          const errorMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content:
              "I couldn't find specific courses matching your request. Could you provide more details about what you'd like to learn? For example, specify a subject area, level, or particular skills you want to develop.",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
        // Check if we have a valid array of courses
        else if (Array.isArray(data.courses) && data.courses.length > 0) {
          // Add AI response
          const aiMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content: "Here are some courses that might interest you:",
          };
          setMessages((prev) => [...prev, aiMessage]);

          // Create a new recommendation set with unique ID
          const newRecommendation: CourseRecommendation = {
            id: uuidv4(),
            query: content,
            courses: data.courses,
            timestamp: Date.now(),
          };

          // Add to existing recommendations instead of replacing
          setCourseRecommendations((prev) => [...prev, newRecommendation]);
        }
        // Handle empty array
        else {
          const noCoursesMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content:
              "I couldn't find any courses matching your criteria. Could you try with different interests or be more specific?",
          };
          setMessages((prev) => [...prev, noCoursesMessage]);
        }
      } else {
        // Add error message
        const errorMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: `Sorry, an error occurred: ${data.error || "Unknown error"}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content:
          "Sorry, an error occurred while processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (recommendationId: string, isPositive: boolean) => {
    const feedbackMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: isPositive
        ? "Thank you for your positive feedback! Is there anything else you'd like to know?"
        : "I'm sorry these recommendations weren't helpful. Could you provide more details about what you're looking for?",
    };
    setMessages((prev) => [...prev, feedbackMessage]);

    // Remove recommendation on negative feedback
    if (!isPositive) {
      setCourseRecommendations((prev) =>
        prev.filter((rec) => rec.id !== recommendationId)
      );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden rounded-lg border">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 transition-colors p-4 space-y-6">
        {showHero && <HeroSection />}

        <div className="space-y-6">
          {messages.map((message, index) => {
            // Find if this message has an associated recommendation
            const relatedRecommendation =
              message.role === "user"
                ? courseRecommendations.find(
                    (rec) => rec.query === message.content
                  )
                : null;

            return (
              <div key={message.id}>
                <ChatMessage message={message} />

                {/* Only show recommendations after assistant's response about courses */}
                {message.role === "assistant" &&
                  message.content ===
                    "Here are some courses that might interest you:" &&
                  index > 0 &&
                  messages[index - 1].role === "user" && (
                    <div className="mt-4">
                      {courseRecommendations
                        .filter(
                          (rec) => rec.query === messages[index - 1].content
                        )
                        .map((recommendation) => (
                          <div key={recommendation.id} className="space-y-4">
                            <CourseList
                              courses={recommendation.courses}
                              userQuery={recommendation.query}
                            />

                            <div className="flex justify-center gap-3 py-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() =>
                                  handleFeedback(recommendation.id, true)
                                }
                              >
                                <ThumbsUp className="h-4 w-4" />
                                Helpful
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() =>
                                  handleFeedback(recommendation.id, false)
                                }
                              >
                                <ThumbsDown className="h-4 w-4" />
                                Not Helpful
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-background/50 backdrop-blur-sm">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
