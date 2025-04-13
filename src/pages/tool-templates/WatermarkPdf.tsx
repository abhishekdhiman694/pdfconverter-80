
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Stamp } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const WatermarkPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
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
  
  const handleWatermark = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a PDF file first."
      });
      return;
    }
    
    if (!watermarkText.trim()) {
      toast({
        variant: "destructive",
        title: "No watermark text",
        description: "Please enter watermark text."
      });
      return;
    }
    
    if (!canConvert) {
      toast({
        variant: "destructive",
        title: "Watermark limit reached",
        description: "Please sign up to watermark more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Watermark PDF
      const pdfBlob = await PDFService.watermarkPdf(file, watermarkText, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_watermarked.pdf');
      
      // Download the watermarked PDF file
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "PDF watermarked",
        description: `Successfully added watermark to ${file.name}.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error watermarking PDF:', error);
      toast({
        variant: "destructive",
        title: "Watermarking failed",
        description: "An error occurred during watermarking. Please try again."
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
              <Stamp size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Watermark PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Add text watermarks to your PDF documents.
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
                
                {file && (
                  <div className="mt-6">
                    <Label htmlFor="watermark">Watermark Text</Label>
                    <div className="flex mt-1.5 mb-4">
                      <Input
                        id="watermark"
                        placeholder="Enter text to use as watermark"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="mr-2"
                      />
                      <Button 
                        onClick={handleWatermark} 
                        className="bg-zenith-500 hover:bg-zenith-600"
                      >
                        Apply Watermark
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to add a watermark to PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Enter the text you want to use as a watermark.</li>
                    <li>Click the "Apply Watermark" button.</li>
                    <li>Download your watermarked PDF.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Watermarking PDF" 
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

export default WatermarkPdf;
