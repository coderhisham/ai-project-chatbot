import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (content.trim() && !isLoading) {
      onSend(content.trim());
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about courses, topics, or skills you want to learn..."
        className="min-h-[50px] max-h-[200px] resize-none pr-14"
        disabled={isLoading}
      />
      <Button
        onClick={handleSend}
        disabled={isLoading || !content.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        size="icon"
      >
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </div>
  );
}
