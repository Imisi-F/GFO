import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChatContainer from "./ChatContainer";

export default function AICFOCard() {
  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="text-lg">Ask AI CFO</CardTitle>
      </CardHeader>
      <CardContent>
        <ChatContainer
          title=""
          initialSuggestions={[
            "What's a cliff?",
            "Is my equity split fair?",
            "Explain vesting schedules",
          ]}
        />
      </CardContent>
    </Card>
  );
}
