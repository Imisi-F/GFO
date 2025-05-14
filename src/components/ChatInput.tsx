
import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  placeholder?: string;
};

const ChatInput = ({ onSendMessage, placeholder = "Type a message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!message.trim()}>
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
