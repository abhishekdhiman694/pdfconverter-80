
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Unlock } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
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
  
  const handleUnlock = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a PDF file first."
      });
      return;
    }
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "No password entered",
        description: "Please enter the PDF password."
      });
      return;
    }
    
    if (!canConvert) {
      toast({
        variant: "destructive",
        title: "Unlock limit reached",
        description: "Please sign up to unlock more PDFs."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Unlock PDF
      const pdfBlob = await PDFService.unlockPdf(file, password, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_unlocked.pdf');
      
      // Download the unlocked PDF file
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "PDF unlocked",
        description: `Successfully unlocked ${file.name}.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      toast({
        variant: "destructive",
        title: "Unlock failed",
        description: "Incorrect password or an error occurred. Please try again."
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
              <Unlock size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Unlock PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Remove password protection from your PDF documents.
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
                    <Label htmlFor="password">PDF Password</Label>
                    <div className="flex mt-1.5 mb-4">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password to unlock the PDF"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mr-2"
                      />
                      <Button 
                        onClick={handleUnlock} 
                        className="bg-zenith-500 hover:bg-zenith-600"
                      >
                        Unlock
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to unlock a PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your password-protected PDF document.</li>
                    <li>Enter the current password for the PDF.</li>
                    <li>Click the "Unlock" button.</li>
                    <li>Download your unlocked PDF.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Unlocking PDF" 
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

export default UnlockPdf;
