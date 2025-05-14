
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfilePage from "./pages/Profile";
import CapTablePage from "./pages/CapTablePage";
import DealBuilderPage from "./pages/DealBuilder";
import DocumentsPage from "./pages/Documents";
import NotFound from "./pages/NotFound";
import Initial from "./pages/Initial";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cap-table" element={<CapTablePage />} />
          <Route path="/deal-builder" element={<DealBuilderPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/authuser" element={<Initial />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
