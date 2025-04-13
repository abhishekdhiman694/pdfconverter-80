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
import PdfToJpg from "./pages/tool-templates/PdfToJpg";
import JpgToPdf from "./pages/tool-templates/JpgToPdf";
import SplitPdf from "./pages/tool-templates/SplitPdf";
import CompressPdf from "./pages/tool-templates/CompressPdf";
import PdfToExcel from "./pages/tool-templates/PdfToExcel";
import ProtectPdf from "./pages/tool-templates/ProtectPdf";
import PdfToPpt from "./pages/tool-templates/PdfToPpt";
import PptToPdf from "./pages/tool-templates/PptToPdf";
import HtmlToPdf from "./pages/tool-templates/HtmlToPdf";
import ExcelToPdf from "./pages/tool-templates/ExcelToPdf";
import EditPdf from "./pages/tool-templates/EditPdf";
import OrganizePdf from "./pages/tool-templates/OrganizePdf";
import UnlockPdf from "./pages/tool-templates/UnlockPdf";
import WatermarkPdf from "./pages/tool-templates/WatermarkPdf";
import RotatePdf from "./pages/tool-templates/RotatePdf";
import OcrPdf from "./pages/tool-templates/OcrPdf";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ConversionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/about" element={<About />} />
            
            {/* Tool routes */}
            <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
            <Route path="/tools/word-to-pdf" element={<WordToPdf />} />
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/compress-pdf" element={<CompressPdf />} />
            <Route path="/tools/pdf-to-excel" element={<PdfToExcel />} />
            <Route path="/tools/protect-pdf" element={<ProtectPdf />} />
            <Route path="/tools/pdf-to-ppt" element={<PdfToPpt />} />
            <Route path="/tools/ppt-to-pdf" element={<PptToPdf />} />
            <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/tools/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/tools/edit-pdf" element={<EditPdf />} />
            <Route path="/tools/organize-pdf" element={<OrganizePdf />} />
            <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/tools/watermark-pdf" element={<WatermarkPdf />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/ocr-pdf" element={<OcrPdf />} />
            
            {/* Other tool routes would go here */}
            <Route path="/tools/:toolName" element={<NotFound />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ConversionProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
