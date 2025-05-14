
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: string;
  isUser?: boolean;
  timestamp?: string;
};

const ChatMessage = ({ message, isUser = false, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className="flex flex-col">
        <div
          className={cn(
            isUser ? "chat-bubble-user" : "chat-bubble-ai",
            "animate-fade-in"
          )}
        >
          <p className="text-sm">{message}</p>
        </div>
        {timestamp && (
          <span className={cn("text-xs text-slate-400 mt-1", 
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
