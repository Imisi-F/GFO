
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatSuggestions from "./ChatSuggestions";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
};

type ChatContainerProps = {
  className?: string;
  title?: string;
  initialSuggestions?: string[];
};

const ChatContainer = ({
  className,
  title = "AI CFO Assistant",
  initialSuggestions = ["Start Cap Table Wizard", "Simulate a Deal", "View Contracts"],
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey founder! 👋 I'm your AI CFO. How can I help your startup today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleNewMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setShowSuggestions(false);
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      
      if (content.toLowerCase().includes("cap table") || content.toLowerCase().includes("equity")) {
        aiResponse = "Let's set up your cap table! I can help you split equity fairly among founders and simulate different scenarios.";
      } else if (content.toLowerCase().includes("deal") || content.toLowerCase().includes("funding")) {
        aiResponse = "Ready to simulate a funding round? I can help you understand how different deal structures impact your ownership.";
      } else if (content.toLowerCase().includes("contract") || content.toLowerCase().includes("document")) {
        aiResponse = "I can help you manage your contracts and legal documents. What would you like to do?";
      } else {
        aiResponse = "I'm here to help with equity splitting, deal simulations, and contract management. What would you like to explore first?";
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setShowSuggestions(true);
    }, 1000);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    handleNewMessage(suggestion);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {title && (
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
          <h2 className="text-lg font-heading font-medium">{title}</h2>
          <Button variant="ghost" size="sm">
            Clear Chat
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </div>

      {showSuggestions && initialSuggestions.length > 0 && (
        <div className="mb-4">
          <ChatSuggestions
            suggestions={initialSuggestions}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </div>
      )}

      <div className="mt-auto">
        <ChatInput
          onSendMessage={handleNewMessage}
          placeholder="Ask your AI CFO..."
        />
      </div>
    </div>
  );
};

export default ChatContainer;
