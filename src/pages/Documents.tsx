
import Layout from "@/components/Layout";
import ChatContainer from "@/components/ChatContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Star, Download, Bell, Trash } from "lucide-react";

const DocumentsPage = () => {
  const documents = [
    {
      id: 1,
      name: "Cap Table - May 2025",
      type: "Cap Tables",
      date: "May 10, 2025",
      starred: true
    },
    {
      id: 2,
      name: "Seed Round SAFE",
      type: "SAFEs",
      date: "Apr 22, 2025",
      starred: false
    },
    {
      id: 3,
      name: "Founder Equity Agreement",
      type: "Equity Agreements",
      date: "Mar 15, 2025",
      starred: true
    },
    {
      id: 4,
      name: "Advisor Agreement",
      type: "Equity Agreements",
      date: "Feb 28, 2025",
      starred: false
    }
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-heading font-bold mb-6">Docs & Contracts Hub</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="glass-card mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Tokenized Docs</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search documents..." 
                    className="pl-9 max-w-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="captables">Cap Tables</TabsTrigger>
                  <TabsTrigger value="safes">SAFEs</TabsTrigger>
                  <TabsTrigger value="equity">Equity Agreements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-2">
                  {documents.map(doc => (
                    <div 
                      key={doc.id}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">
                            {doc.name}
                            {doc.starred && (
                              <Star className="h-4 w-4 text-amber-500 inline ml-2" fill="currentColor" />
                            )}
                          </h3>
                          <Badge variant="outline">{doc.type}</Badge>
                        </div>
                        <p className="text-xs text-slate-400">{doc.date}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="captables">
                  {documents.filter(doc => doc.type === "Cap Tables").map(doc => (
                    <div 
                      key={doc.id}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">
                            {doc.name}
                            {doc.starred && (
                              <Star className="h-4 w-4 text-amber-500 inline ml-2" fill="currentColor" />
                            )}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400">{doc.date}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                {/* Similar content for other tabs would go here */}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-800/50 p-6 rounded-lg min-h-60 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-300">Select a document to preview</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notify
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-950/20">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-lg">Document Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatContainer 
                title="" 
                initialSuggestions={[
                  "Explain this document", 
                  "Create a new SAFE", 
                  "Update cap table"
                ]} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentsPage;
