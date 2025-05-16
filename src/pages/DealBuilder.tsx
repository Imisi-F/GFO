
import { useState } from "react";
import Layout from "@/components/Layout";
import ChatContainer from "@/components/ChatContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DealBuilderPage = () => {
  const [dealPrompt, setDealPrompt] = useState("");

  const sampleData = [
    { name: 'Initial', founder: 100, investor: 0 },
    { name: 'Seed', founder: 80, investor: 20 },
    { name: 'Series A', founder: 64, investor: 36 },
    { name: 'Series B', founder: 51, investor: 49 },
    { name: 'Exit', founder: 51, investor: 49 },
  ];

  const handleDealAnalysis = () => {
    console.log("Analyzing deal:", dealPrompt);
    // This would connect to OpenAI in a complete implementation
  };

  return (
    <Layout>
      <h1 className="text-3xl font-heading font-bold mb-6">Smart Deal Builder</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle>Describe Your Deal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="E.g., We raise $500k on a $5M SAFE..."
                  value={dealPrompt}
                  onChange={(e) => setDealPrompt(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={handleDealAnalysis}>Analyze Deal</Button>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3">Deal Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Total Raised</p>
                      <p className="text-xl font-medium">$500,000</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Dilution</p>
                      <p className="text-xl font-medium">9.1%</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm text-slate-400">Founder Ownership</p>
                      <p className="text-xl font-medium">90.9%</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-3">Ownership Simulator</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="founder"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Founder %"
                    />
                    <Line
                      type="monotone"
                      dataKey="investor"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Investor %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline">Save Scenario</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4 mr-2" /> Send Simulation
            </Button>
          </div>
        </div>

        <div className="col-span-1">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">AI CFO Deal Helper</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatContainer
                title=""
                initialSuggestions={[
                  "Is this a good term sheet?",
                  "Explain SAFE notes",
                  "Simulate $1M exit"
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DealBuilderPage;
