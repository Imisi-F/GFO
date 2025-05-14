
import ChatContainer from "@/components/ChatContainer";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <h1 className="text-4xl font-heading font-bold mb-2 text-center gradient-text">GFO – AI CFO for Founders</h1>
      <p className="text-xl text-slate-300 mb-8 text-center max-w-2xl">
        Your smart, conversational financial co-pilot for equity, deals, and funding
      </p>
      
      <Card className="glass-card w-full max-w-2xl">
        <CardContent className="p-6 h-[60vh]">
          <ChatContainer />
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-slate-400">
        <p>Powered by Stellar smart contracts, OpenAI, and Firebase</p>
      </div>
    </div>
  );
};

export default Index;
