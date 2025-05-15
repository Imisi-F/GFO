"use client";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityWizard from "@/components/EquityWizard";
import CapTable from "@/components/CapTable";
import AICFOCard from "@/components/AICFOCard";
import { Button } from "@/components/ui/button";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFounder } from "@/utils/soroban";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { EditRequest } from "@/types";

export default function CapTablePage() {
  interface Founder {
    id: string;
    name: string;
    role?: string;
    equity: number;
    vested?: string;
    cliff?: string;
    publicKey: string;
    tokenized: string;
  }

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the Finish button click
      fetchFounders();  // Refresh founders on finish
      console.log("Finished wizard and refreshed founders");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [founderData, setFounderData] = useState<Founder[]>([]);
  const auth = getAuth();

  // Fetch all founders from Firestore and get tokenization status from Soroban
  const fetchFounders = async () => {
    if (!auth.currentUser) return;
    try {
      const foundersSnapshot = await getDocs(collection(db, "founders"));
      const foundersArray = await Promise.all(
        foundersSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as Founder;
          const sorobanData = await getFounder(data.publicKey);
          return {
            id: docSnap.id,
            ...data,
            tokenized: sorobanData?.tokenized ? "Yes" : "No",
          };
        })
      );
      setFounderData(foundersArray);
    } catch (error) {
      console.error("Error fetching founders:", error);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  // Add a new founder with default data to Firestore
  const handleAddFounder = async () => {
    if (!auth.currentUser) return;
    try {
      const newFounder: Founder = {
        id: 'gb25ln',
        name: "Bob",
        role: "CTO",
        equity: 20,
        vested: "0%",
        cliff: "1 year",
        publicKey: "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with valid key
        tokenized: "No",
      };
      await addDoc(collection(db, "founders"), newFounder);
      await fetchFounders();
    } catch (error) {
      console.error("Error adding founder:", error);
    }
  };

  // Update tokenization status for all founders and save to Firestore
  const handleTokenize = async () => {
    try {
      const updatedFounders = await Promise.all(
        founderData.map(async (founder) => {
          const sorobanData = await getFounder(founder.publicKey);
          const tokenizedStatus = sorobanData?.tokenized ? "Yes" : "No";
          if (founder.id && tokenizedStatus !== founder.tokenized) {
            await updateDoc(doc(db, "founders", founder.id), {
              tokenized: tokenizedStatus,
            });
          }
          return { ...founder, tokenized: tokenizedStatus };
        })
      );
      setFounderData(updatedFounders);
      console.log("Tokenization status updated");
    } catch (error) {
      console.error("Error during tokenization:", error);
    }
  };

  const steps = [
    { title: "Define Roles", description: "Describe each founder’s responsibilities" },
    { title: "Equity Split", description: "We suggest a split based on roles & commitment" },
    { title: "Vesting Terms", description: "Add vesting & cliffs to protect your team" },
    { title: "Review", description: "Review & confirm your equity structure" },
  ];

  const handleEditRequest = (request: EditRequest) => {
    console.log("Received equity request:", request);
    // Handle it (e.g., send to Firestore or notify stakeholders)
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Cap Table Manager</h1>
        <div className="mb-4">
          <Button onClick={handleAddFounder}>Add Founder</Button>
        </div>
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
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              </TabsContent>

              <TabsContent value="table">
                <CapTable
                  founderData={founderData.map(f => ({
                    ...f,
                    tokenized: f.tokenized ? "Yes" : "No",
                  }))}
                  onEditRequest={handleEditRequest}
                />
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline">Export PDF</Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleTokenize}
                  >
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
