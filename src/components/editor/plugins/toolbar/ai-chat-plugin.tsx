"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function AIChatPlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual AI API call)
    try {
      // This is a mock response - you'll want to replace this with actual AI integration
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIMockResponse(userMessage.content),
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble responding right now. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("relative", isOpen && "bg-accent")}
        title="AI Chat Assistant"
      >
        <MessageSquare className="size-5" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full size-4 flex items-center justify-center">
            {messages.filter((m) => m.role === "assistant").length}
          </span>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed top-4 right-4 bg-background border border-border rounded-lg shadow-lg z-50 transition-all duration-200",
            isMinimized ? "w-80 h-12" : "w-96 h-[500px]"
          )}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="size-6"
              >
                {isMinimized ? (
                  <Maximize2 className="size-3" />
                ) : (
                  <Minimize2 className="size-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="size-6"
              >
                <X className="size-3" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 h-[380px]">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <MessageSquare className="size-8 mx-auto mb-2 opacity-50" />
                    <p>Start a conversation with your AI assistant!</p>
                    <p className="text-xs mt-1">
                      Ask questions about your notes or get writing help.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 block mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="size-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="size-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="size-2 bg-current rounded-full animate-bounce"></div>
                        </div>
                        <span className="ml-2 text-muted-foreground">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask AI anything..."
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="size-9"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
                  >
                    Clear conversation
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

// Mock AI responses - replace with actual AI integration
function getAIMockResponse(userMessage: string): string {
  const responses = [
    "That's an interesting point! Let me help you expand on that idea. Consider exploring the different perspectives on this topic.",
    "I can help you organize these thoughts better. Would you like me to suggest a structure for your notes?",
    "Great question! Here are some key points you might want to include in your notes about this topic.",
    "I notice you're working on this concept. Here's another angle you might find useful to consider.",
    "That's a solid foundation. You could strengthen this by adding some specific examples or evidence.",
    "I can help you break this down into smaller, more manageable sections. Would that be helpful?",
    "This is a complex topic. Let me suggest a few ways to approach it systematically.",
    "I see what you're getting at. Here's how you might connect this to your other notes.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
