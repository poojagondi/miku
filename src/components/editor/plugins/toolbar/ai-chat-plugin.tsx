"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface StoredMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string; // Date stored as string in localStorage
}

export function AIChatPlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get current user session
  const { data: session, isPending } = useSession();

  // LocalStorage key for chat history (user-specific)
  const CHAT_STORAGE_KEY = session?.user?.id
    ? `miku-chat-history-${session.user.id}`
    : "miku-chat-history-guest";

  // Load chat history from localStorage on mount or when user changes
  useEffect(() => {
    // Don't load if session is still loading
    if (isPending) return;

    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map(
          (msg: StoredMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp), // Convert string back to Date
          })
        );
        setMessages(parsedMessages);
      } else {
        // Clear messages if no saved data for this user
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
    }
  }, [CHAT_STORAGE_KEY, isPending]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages, CHAT_STORAGE_KEY]);

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

    try {
      // Call the actual chatbot API
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })), // Include chat history
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || "Sorry, I couldn't generate a response.",
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
    // Also clear from localStorage
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear chat history from localStorage:", error);
    }
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
              <span className="font-medium text-sm">Miku Assistant</span>
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
                    <p>Start a conversation with Miku!</p>
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
                          Miku is thinking...
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
                    placeholder="Ask Miku anything..."
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
                    Clear conversation history
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
