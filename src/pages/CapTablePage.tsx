"use client";
import Layout from "@/components/Layout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityWizard from "@/components/EquityWizard";
import CapTable from "@/components/CapTable";
import AICFOCard from "@/components/AICFOCard";

export default function CapTablePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFounder, setSelectedFounder] = useState<any>(null);

  const [founderData, setFounderData] = useState([
    { name: "Alice", role: "CEO", equity: "50%", vested: "Yes", cliff: "1 year", tokenized: "No" },
    { name: "Bob", role: "CTO", equity: "30%", vested: "No", cliff: "1 year", tokenized: "No" },
    { name: "Charlie", role: "CMO", equity: "20%", vested: "Yes", cliff: "1 year", tokenized: "Yes" },
  ]);

  const steps = [
    { title: "Define Roles", description: "Describe each founder’s responsibilities" },
    { title: "Equity Split", description: "We suggest a split based on roles & commitment" },
    { title: "Vesting Terms", description: "Add vesting & cliffs to protect your team" },
    { title: "Review", description: "Review & confirm your equity structure" },
  ];

  const handleEditRequest = (updatedFounder: any) => {
    if (!updatedFounder) return;
    // You can add logic to update founderData here
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Cap Table Manager</h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Tabs defaultValue="wizard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="wizard">Equity Wizard</TabsTrigger>
                <TabsTrigger value="table">Cap Table</TabsTrigger>
              </TabsList>

              <TabsContent value="wizard">
                <EquityWizard
                  steps={steps}
                  currentStep={currentStep}
                  founderData={founderData}
                  onNext={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                  onPrev={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                />
              </TabsContent>

              <TabsContent value="table">
                <CapTable founderData={founderData} onEdit={setSelectedFounder} />
              </TabsContent>
            </Tabs>
          </div>

          <AICFOCard />
        </div>
      </div>
    </Layout>
  );
}
