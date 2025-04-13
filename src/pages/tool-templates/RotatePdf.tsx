
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { RotateCw } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const RotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState<number>(90);
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
  
  const handleRotate = async () => {
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
        title: "Rotation limit reached",
        description: "Please sign up to rotate more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Rotate PDF (apply to all pages)
      const pdfBlob = await PDFService.rotatePdf(file, rotation, [], setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_rotated.pdf');
      
      // Download the rotated PDF file
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "PDF rotated",
        description: `Successfully rotated ${file.name}.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error rotating PDF:', error);
      toast({
        variant: "destructive",
        title: "Rotation failed",
        description: "An error occurred during rotation. Please try again."
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
              <RotateCw size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Rotate PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Rotate pages in your PDF documents.
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
                    <div className="mb-4">
                      <p className="font-medium mb-2">Rotation Angle:</p>
                      <RadioGroup 
                        defaultValue="90" 
                        value={rotation.toString()}
                        onValueChange={(value) => setRotation(parseInt(value))}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="90" id="r90" />
                          <Label htmlFor="r90">90° Clockwise</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="180" id="r180" />
                          <Label htmlFor="r180">180°</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="270" id="r270" />
                          <Label htmlFor="r270">90° Counter-clockwise</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Button 
                      onClick={handleRotate} 
                      className="bg-zenith-500 hover:bg-zenith-600"
                    >
                      Rotate PDF
                    </Button>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to rotate PDF pages</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Select the rotation angle (90°, 180°, or 270°).</li>
                    <li>Click the "Rotate PDF" button.</li>
                    <li>Download your rotated PDF.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Rotating PDF" 
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

export default RotatePdf;
