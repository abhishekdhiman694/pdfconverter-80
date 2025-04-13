
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileOutput } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const JpgToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { canConvert, incrementConversion } = useConversion();
  
  const handleFileChange = (uploadedFiles: File[]) => {
    // Check if files are images
    const imageFiles = uploadedFiles.filter(file => 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' || 
      file.type === 'image/png'
    );
    
    if (imageFiles.length !== uploadedFiles.length) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload only JPG or PNG images."
      });
    }
    
    setFiles(imageFiles);
  };
  
  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please upload at least one image file."
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
      // Convert JPG to PDF
      const pdfBlob = await PDFService.jpgToPdf(files, setProgress);
      
      // Generate filename based on the first image
      const fileName = files[0].name.split('.')[0] + '_combined.pdf';
      
      // Download the PDF
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "Conversion complete",
        description: `Successfully converted ${files.length} image(s) to PDF.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error converting JPG to PDF:', error);
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
              <FileOutput size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">JPG to PDF Converter</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Convert and combine your JPG images into a single PDF document.
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
                  acceptedFileTypes=".jpg,.jpeg,.png"
                  maxFiles={10}
                  currentFiles={files}
                  multiple={true}
                />
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleConvert} 
                    disabled={files.length === 0}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Convert to PDF
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to convert JPG to PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload one or more JPG/PNG images.</li>
                    <li>Images will be combined in the order they are uploaded.</li>
                    <li>Click the "Convert to PDF" button.</li>
                    <li>Download your PDF document.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={files.length === 1 ? files[0].name : `${files.length} images`} 
                  conversionType="JPG to PDF" 
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

export default JpgToPdf;
