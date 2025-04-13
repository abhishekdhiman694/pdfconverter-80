import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConversionProvider } from "@/contexts/ConversionContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Tools from "./pages/Tools";
import About from "./pages/About";

// Tool pages
import PdfToWord from "./pages/tool-templates/PdfToWord";
import WordToPdf from "./pages/tool-templates/WordToPdf";
import MergePdf from "./pages/tool-templates/MergePdf";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ConversionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/about" element={<About />} />
            
            {/* Tool routes */}
            <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
            <Route path="/tools/word-to-pdf" element={<WordToPdf />} />
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            
            {/* Other tool routes would go here */}
            <Route path="/tools/:toolName" element={<NotFound />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConversionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
