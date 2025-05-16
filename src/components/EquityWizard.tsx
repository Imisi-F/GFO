import { Steps, Step, StepTitle, StepDescription } from "@/components/ui/steps";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";

interface StepType {
  title: string;
  description: string;
}

interface Props {
  steps: StepType[];
  currentStep: number;
  founderData: any[];
  onNext: () => void;
  onPrev: () => void;
}

export default function EquityWizard({ steps, currentStep, founderData, onNext, onPrev }: Props) {
  return (
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
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-sm">Define each founder's role and time commitment to help calculate a fair equity split.</p>
              </div>
              <div className="mt-auto">
                <ChatInput
                  onSendMessage={() => console.log('hi')}
                  placeholder="Add your Role."
                />
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
                <p className="text-sm">Configure vesting schedules to protect all founders</p>
                </div><div className="mt-4">
                <ChatInput
                  onSendMessage={() => console.log('hi')}
                  placeholder="Brief overview of ideal vesting"
                />
              </div>
              
              
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in">
              <p className="text-slate-300 mb-4">Review and confirm your equity structure:</p>
              <div className="">
                <Button>View Summary</Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev} disabled={currentStep === 0}>Previous</Button>
          <Button onClick={onNext}>
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}
