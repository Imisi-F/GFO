
import { useState } from "react";
import Layout from "@/components/Layout";
import ChatContainer from "@/components/ChatContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Steps, Step, StepTitle, StepDescription } from "@/components/ui/steps";

const CapTablePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Roles & Time Commitment",
      description: "Define founder roles and time commitments"
    },
    {
      title: "Equity Split Suggestions",
      description: "Review AI-suggested equity distributions"
    },
    {
      title: "Vesting & Cliffs",
      description: "Configure vesting schedules and cliffs"
    },
    {
      title: "Review & Confirm",
      description: "Finalize your cap table setup"
    }
  ];
  
  const founderData = [
    { name: "Alex Chen", role: "CEO", equity: "45%", vested: "15%", cliff: "1 year", tokenized: "Yes" },
    { name: "Jamie Smith", role: "CTO", equity: "35%", vested: "10%", cliff: "1 year", tokenized: "Yes" },
    { name: "Taylor Reed", role: "COO", equity: "20%", vested: "5%", cliff: "1 year", tokenized: "Yes" }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-heading font-bold mb-6">Cap Table Manager</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="wizard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="wizard">Equity Wizard</TabsTrigger>
              <TabsTrigger value="table">Cap Table</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wizard">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Founders & Equity Wizard</CardTitle>
                </CardHeader>
                <CardContent>
                  <Steps currentStep={currentStep} className="mb-8">
                    {steps.map((step, index) => (
                      <Step key={index} completed={currentStep > index}>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Step>
                    ))}
                  </Steps>
                  
                  <div className="min-h-80 mb-6">
                    {currentStep === 0 && (
                      <div className="space-y-4 animate-fade-in">
                        <p className="text-slate-300">Define each founder's role and time commitment to help calculate a fair equity split.</p>
                        {/* Role input fields would go here */}
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <p className="text-sm">This is a sample step. In a complete implementation, this would contain forms for role definition.</p>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 1 && (
                      <div className="animate-fade-in">
                        <p className="text-slate-300 mb-4">Based on roles and contributions, here's our suggested equity split:</p>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <div className="grid grid-cols-3 gap-4">
                            {founderData.map((founder, i) => (
                              <div key={i} className="p-4 bg-slate-700/50 rounded-lg text-center">
                                <p className="font-medium mb-1">{founder.name}</p>
                                <p className="text-2xl font-bold text-primary mb-1">{founder.equity}</p>
                                <p className="text-xs text-slate-400">{founder.role}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 2 && (
                      <div className="animate-fade-in">
                        <p className="text-slate-300 mb-4">Configure vesting schedules to protect all founders:</p>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <p className="text-sm">This is a placeholder for the vesting configuration UI.</p>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div className="animate-fade-in">
                        <p className="text-slate-300 mb-4">Review and confirm your equity structure:</p>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <p className="text-sm">Summary of all settings would appear here for final review.</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={currentStep === steps.length - 1}
                    >
                      {currentStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="table">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Live Cap Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-left p-3">Equity %</th>
                          <th className="text-left p-3">Vested</th>
                          <th className="text-left p-3">Cliff</th>
                          <th className="text-left p-3">Tokenized</th>
                        </tr>
                      </thead>
                      <tbody>
                        {founderData.map((founder, i) => (
                          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                            <td className="p-3">{founder.name}</td>
                            <td className="p-3">{founder.role}</td>
                            <td className="p-3 font-medium">{founder.equity}</td>
                            <td className="p-3">{founder.vested}</td>
                            <td className="p-3">{founder.cliff}</td>
                            <td className="p-3">
                              <Badge variant={founder.tokenized === "Yes" ? "default" : "outline"}>{founder.tokenized}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline">Export PDF</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Tokenize via Stellar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-1">
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
                  "Explain vesting schedules"
                ]} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CapTablePage;
