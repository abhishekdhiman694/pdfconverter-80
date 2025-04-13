
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const OcrPdf = () => {
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
  
  const handleOcr = async () => {
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
        title: "OCR limit reached",
        description: "Please sign up to OCR more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Perform OCR on PDF
      const pdfBlob = await PDFService.ocrPdf(file, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_ocr.pdf');
      
      // Download the OCR-processed PDF file
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "OCR complete",
        description: `Successfully made ${file.name} searchable.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error performing OCR on PDF:', error);
      toast({
        variant: "destructive",
        title: "OCR failed",
        description: "An error occurred during OCR processing. Please try again."
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
              <Search size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">OCR PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Make scanned PDFs searchable with Optical Character Recognition (OCR).
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
                  acceptedFileTypes=".pdf"
                  maxFiles={1}
                  currentFiles={file ? [file] : []}
                />
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleOcr} 
                    disabled={!file}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Make Searchable
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to perform OCR on a PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your scanned PDF document.</li>
                    <li>Click the "Make Searchable" button.</li>
                    <li>Wait for the OCR process to complete.</li>
                    <li>Download your searchable PDF.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="OCR Processing" 
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

export default OcrPdf;
