"use client";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityWizard from "@/components/EquityWizard";
import CapTable from "@/components/CapTable";
import AICFOCard from "@/components/AICFOCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { EditRequest, Founder } from "@/types";
import { initFounder, getFounder } from "@/utils/soroban";
const tokenContractId = import.meta.env.VITE_TOKEN_CONTRACT_ID!;

export default function CapTablePage() {
  interface Founder {
    id: string;
    userId?: string;
    name: string;
    role?: string;
    equity: number;
    vested?: string;
    cliff?: string;
    publicKey: string;
    tokenized: string;
  }
  const userPublicKey = localStorage.getItem("publicKey");

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
  const accountExists = async (publicKey: string) => {
    try {
      const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
      return res.ok;
    } catch {
      return false;
    }
  };

  // Fetch all founders from Firestore and get tokenization status from Soroban
  const fetchFounders = async () => {
    if (!auth.currentUser) return;
    try {
      const foundersSnapshot = await getDocs(collection(db, "founders"));
      const foundersArray = await Promise.all(
        foundersSnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as Founder;

          let tokenized = "No";
          const exists = await accountExists(data.publicKey);
          if (exists) {
            const sorobanData = await getFounder(data.publicKey);
            tokenized = sorobanData && sorobanData.tokenized ? "Yes" : "No";
          }

          return {
            id: docSnap.id,
            ...data,
            tokenized,
            explorerUrl: `https://testnet.stellarscan.io/account/${data.publicKey}`,
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

  // Add a new founder with default data to Firestore
  const handleYourselfAsFounder = async () => {
    if (!auth.currentUser) return;
    try {
      const youFounder: Founder = {
        id: 'se1f',
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        role: "CEO",
        equity: 20,
        vested: "0%",
        cliff: "1 year",
        publicKey: userPublicKey, // Replace with valid key
        tokenized: "No",
      };
      await addDoc(collection(db, "founders"), youFounder);
      await fetchFounders();
    } catch (error) {
      console.error("Error adding founder:", error);
    }
  };

  // Update tokenization status for all founders and save to Firestore
  // Mint tokens for a single founder
  const handleMintFounder = async (founder: Founder) => {
    try {
      await initFounder(founder.publicKey, founder.name, founder.equity);
      console.log(`Founder ${founder.name} tokenized successfully.`);
    } catch (error) {
      console.error(`Failed to tokenize founder ${founder.name}:`, error);
      alert(`Error tokenizing founder ${founder.name}. Check console.`);
    }
  };

  // Tokenize all founders who are not tokenized yet
  const handleTokenize = async () => {
    try {
      for (const founder of founderData) {
        if (founder.tokenized === "No") {
          await handleMintFounder(founder);
          // Update Firestore status for this founder
          if (founder.id) {
            await updateDoc(doc(db, "founders", founder.id), { tokenized: "Yes" });
          }
          const explorerLink = `https://testnet.stellarscan.io/account/${founder.publicKey}`;
        }
      }
      // Refresh founders after tokenization
      await fetchFounders();
      console.log("Tokenization process completed.");
    } catch (error) {
      console.error("Error during tokenization:", error);
      alert("Error during tokenization. See console for details.");
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
                </div> <br />
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="text-lg mb-0">Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-0 flex gap-2">
                      <Button onClick={handleAddFounder}>Add Shareholder</Button>
                      <Button onClick={handleYourselfAsFounder}>Add Yourself</Button>
                      <Button onClick={fetchFounders}>Refresh Table</Button>
                    </div></CardContent> </Card>
              </TabsContent>
            </Tabs>
          </div>

          <AICFOCard />
        </div>
      </div>
    </Layout>
  );
}
