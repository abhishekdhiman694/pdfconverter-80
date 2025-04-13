
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Scissors } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { canConvert, incrementConversion } = useConversion();
  
  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      // Check if file is a PDF
      if (files[0].type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF file."
        });
        return;
      }
      
      setFile(files[0]);
    }
  };
  
  const handleSplit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a PDF file first."
      });
      return;
    }
    
    if (!canConvert) {
      toast({
        variant: "destructive",
        title: "Split limit reached",
        description: "Please sign up to split more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Split the PDF into individual pages
      const pdfBlobs = await PDFService.splitPdf(file, setProgress);
      
      // Download the resulting PDF files
      PDFService.downloadBlobs(pdfBlobs, file.name.replace('.pdf', ''));
      
      toast({
        title: "Split complete",
        description: `Successfully split ${file.name} into ${pdfBlobs.length} pages.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error splitting PDF:', error);
      toast({
        variant: "destructive",
        title: "Split failed",
        description: "An error occurred while splitting the PDF. Please try again."
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
              <Scissors size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Split PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Extract pages from your PDF into separate PDF files.
          </p>
        </div>
      </section>
      
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            {!isConverting ? (
              <>
                <FileUpload
                  onFilesSelected={handleFileChange}
                  accept=".pdf"
                  maxFiles={1}
                  currentFiles={file ? [file] : []}
                />
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleSplit} 
                    disabled={!file}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Split PDF
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to split PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Click the "Split PDF" button.</li>
                    <li>Each page of your PDF will be extracted as a separate PDF file.</li>
                    <li>Download the resulting PDF files.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Split PDF" 
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

export default SplitPdf;
