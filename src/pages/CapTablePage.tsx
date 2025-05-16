"use client";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquityWizard from "@/components/EquityWizard";
import CapTable from "@/components/CapTable";
import AICFOCard from "@/components/AICFOCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { EditRequest, Founder } from "@/types";
import { initFounder, getFounder } from "@/utils/soroban";

const tokenContractId = import.meta.env.VITE_TOKEN_CONTRACT_ID!;
const userPublicKey = localStorage.getItem("publicKey");

export default function CapTablePage() {
  const auth = getAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [founderData, setFounderData] = useState<Founder[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      fetchFounders(); // Refresh on finish
      console.log("Finished wizard and refreshed founders");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const accountExists = async () => {
    try {
      const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${userPublicKey}`);
      return res.ok;
    } catch {
      return false;
    }
  };

  const fetchFounders = async () => {
    if (!auth.currentUser) return;
    try {
      const snapshot = await getDocs(collection(db, "founders"));
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const founder = docSnap.data() as Founder;
          let tokenized = founder.tokenized;

          const exists = await accountExists();
          if (exists) {
            try {
              const onChainData = await getFounder(founder.publicKey);
              tokenized = onChainData?.tokenized ?? false;
            } catch (err) {
              console.warn(`Founder ${founder.name} not found on-chain.`);
            }
          }

          return {
            id: docSnap.id,
            ...founder,
            tokenized,
            explorerUrl: `https://stellar.expert/explorer/testnet/account/${founder.publicKey}`,
          };
        })
      );
      setFounderData(data);
    } catch (error) {
      console.error("Error fetching founders:", error);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  const handleYourselfAsFounder = async () => {
    if (!auth.currentUser) return;
    try {
      const youFounder: Founder = {
        id: "se1f",
        name: auth.currentUser.displayName ?? "You",
        role: "CEO",
        equity: 20,
        vested: "0%",
        cliff: "1 year",
        publicKey: userPublicKey!,
        tokenized: false,
      };
      await addDoc(collection(db, "founders"), youFounder);
      await fetchFounders();
    } catch (error) {
      console.error("Error adding founder:", error);
    }
  };

  const handleMintFounder = async (founder: Founder) => {
    try {
      await initFounder(founder.publicKey, founder.name, founder.equity);
      await setDoc(doc(db, "founders", founder.id!), {
        ...founder,
        tokenized: true,
      });
      console.log(`Founder ${founder.name} tokenized successfully.`);
    } catch (error) {
      console.error(`Failed to tokenize founder ${founder.name}:`, error);
      alert(`Error tokenizing founder ${founder.name}.`);
    }
  };

  const handleTokenize = async () => {
    try {
      for (const founder of founderData) {
        if (!founder.tokenized) {
          await handleMintFounder(founder);
        }
      }
      await fetchFounders();
      console.log("Tokenization process completed.");
    } catch (error) {
      console.error("Tokenization error:", error);
      alert("Tokenization failed. See console.");
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
                  founderData={founderData}
                  onEditRequest={handleEditRequest}
                  onTokenizeFounder={handleMintFounder}
                />

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline">Export PDF</Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleTokenize}
                  >
                    Tokenize All
                  </Button>
                </div>
                <br />
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="text-lg mb-0">Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-0 flex gap-2">
                      <Button onClick={handleYourselfAsFounder}>Add Yourself</Button>
                      <Button onClick={fetchFounders}>Refresh Table</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <AICFOCard />
        </div>
      </div>
    </Layout>
  );
}
