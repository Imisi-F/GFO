"use client";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityWizard from "@/components/EquityWizard";
import CapTable from "@/components/CapTable";
import AICFOCard from "@/components/AICFOCard";
import { Button } from "@/components/ui/button";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getFounder } from "@/utils/soroban";
import { useState, useEffect } from "react";

export default function CapTablePage() {
  const [founderData, setFounderData] = useState<any[]>([]); // Declare founderData state once

  useEffect(() => {
    const fetchFounderData = async () => {
      try {
        // Fetch founder data from Firestore (assuming user is logged in)
        const db = getFirestore();
        const userDocRef = doc(db, "users", "user_uid"); // Replace with actual UID
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const founder = userDocSnap.data();

          // Fetch tokenized status from Soroban using founder's publicKey
          const sorobanData = await getFounder(founder.publicKey);

          // Add tokenized info to founder data
          setFounderData([
            {
              ...founder,
              tokenized: sorobanData.tokenized ? "Yes" : "No",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching founder data:", error);
      }
    };

    fetchFounderData();
  }, []);

  // Function to handle tokenization action
  const handleTokenize = async () => {
    try {
      // Loop through each founder and tokenize them
      const db = getFirestore();
      const updatedFounderData = await Promise.all(
        founderData.map(async (founder) => {
          // Assuming each founder has a publicKey field
          const sorobanData = await getFounder(founder.publicKey);

          if (sorobanData.tokenized) {
            // Update tokenized field to Yes if the contract shows it's tokenized
            return { ...founder, tokenized: "Yes" };
          }

          // Handle the case if not tokenized yet
          return founder;
        })
      );

      // Update the state with the new data
      setFounderData(updatedFounderData);

      // Optionally, save updated data to Firestore for future reference
      const docRef = doc(db, "founders", "founder-id"); // Make sure you update the document reference
      await setDoc(docRef, { founders: updatedFounderData });

      console.log("Tokenization successful");
    } catch (err) {
      console.error("Error during tokenization:", err);
    }
  };

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
                  currentStep={0} // Set the currentStep value (initialize with 0)
                  founderData={founderData}
                  onNext={() => { }}
                  onPrev={() => { }}
                />
              </TabsContent>

              <TabsContent value="table">
                <CapTable founderData={founderData} onEdit={handleEditRequest} />
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline">Export PDF</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleTokenize}>
                    Tokenize via Stellar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <AICFOCard />
        </div>
      </div>
    </Layout>
  );
}
