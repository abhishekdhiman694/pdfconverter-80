
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Globe } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const HtmlToPdf = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { canConvert, incrementConversion } = useConversion();
  
  const handleConvert = async () => {
    if (!htmlContent.trim()) {
      toast({
        variant: "destructive",
        title: "No content",
        description: "Please enter some HTML content first."
      });
      return;
    }
    
    if (!canConvert) {
      toast({
        variant: "destructive",
        title: "Conversion limit reached",
        description: "Please sign up to convert more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Convert HTML to PDF
      const pdfBlob = await PDFService.htmlToPdf(htmlContent, setProgress);
      
      // Download the PDF file
      PDFService.downloadBlob(pdfBlob, 'converted-html.pdf');
      
      toast({
        title: "Conversion complete",
        description: "Successfully converted HTML to PDF format."
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "An error occurred during conversion. Please try again."
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-zenith-100 p-4 rounded-full">
              <Globe size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">HTML to PDF Converter</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Convert HTML content to PDF documents.
          </p>
        </div>
      </section>
      
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            {!isConverting ? (
              <>
                <div className="mb-6">
                  <label htmlFor="html-content" className="block text-sm font-medium text-gray-700 mb-2">
                    HTML Content
                  </label>
                  <Textarea
                    id="html-content"
                    placeholder="Paste your HTML content here..."
                    className="min-h-[250px]"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleConvert} 
                    disabled={!htmlContent.trim()}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Convert to PDF
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to convert HTML to PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Paste your HTML content into the text area.</li>
                    <li>Click the "Convert to PDF" button.</li>
                    <li>Wait for the conversion to complete.</li>
                    <li>Download your PDF document.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName="HTML Content" 
                  conversionType="HTML to PDF" 
                />
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HtmlToPdf;
