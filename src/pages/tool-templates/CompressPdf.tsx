
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Minimize2 } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
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
  
  const handleCompress = async () => {
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
        title: "Compression limit reached",
        description: "Please sign up to compress more files."
      });
      return;
    }
    
    setIsCompressing(true);
    setProgress(0);
    
    try {
      // Compress the PDF
      const compressedPdf = await PDFService.compressPdf(file, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_compressed.pdf');
      
      // Download the compressed PDF
      PDFService.downloadBlob(compressedPdf, fileName);
      
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (compressedPdf.size / 1024 / 1024).toFixed(2);
      const reduction = (((file.size - compressedPdf.size) / file.size) * 100).toFixed(1);
      
      toast({
        title: "Compression complete",
        description: `Reduced from ${originalSize} MB to ${compressedSize} MB (${reduction}% smaller).`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error compressing PDF:', error);
      toast({
        variant: "destructive",
        title: "Compression failed",
        description: "An error occurred during compression. Please try again."
      });
    } finally {
      setIsCompressing(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-zenith-100 p-4 rounded-full">
              <Minimize2 size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Compress PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Reduce your PDF file size while maintaining quality.
          </p>
        </div>
      </section>
      
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            {!isCompressing ? (
              <>
                <FileUpload
                  onFilesSelected={handleFileChange}
                  accept=".pdf"
                  maxFiles={1}
                  currentFiles={file ? [file] : []}
                />
                
                {file && (
                  <div className="mt-4 text-center text-sm text-zinc-600">
                    Original size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleCompress} 
                    disabled={!file}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Compress PDF
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to compress PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Click the "Compress PDF" button.</li>
                    <li>Wait for compression to complete.</li>
                    <li>Download your compressed PDF file.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Compress PDF" 
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

export default CompressPdf;
