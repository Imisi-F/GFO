
import { Button } from "@/components/ui/button";

type SuggestionProps = {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
};

const ChatSuggestions = ({ suggestions, onSelectSuggestion }: SuggestionProps) => {
  return (
    <div className="flex flex-col gap-2 animate-slide-up">
      <p className="text-sm text-slate-400 mb-1">Suggestions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSelectSuggestion(suggestion)}
            className="text-xs py-1 h-auto border-slate-700 hover:bg-slate-800"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;
