
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Lock } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const ProtectPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProtecting, setIsProtecting] = useState(false);
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
  
  const handleProtect = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload a PDF file first."
      });
      return;
    }
    
    if (!password) {
      toast({
        variant: "destructive",
        title: "Password required",
        description: "Please enter a password."
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please ensure both passwords match."
      });
      return;
    }
    
    if (password.length < 4) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Please use a password with at least 4 characters."
      });
      return;
    }
    
    if (!canConvert) {
      toast({
        variant: "destructive",
        title: "Protection limit reached",
        description: "Please sign up to protect more files."
      });
      return;
    }
    
    setIsProtecting(true);
    setProgress(0);
    
    try {
      // Protect the PDF with a password
      const protectedPdf = await PDFService.protectPdf(file, password, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_protected.pdf');
      
      // Download the protected PDF
      PDFService.downloadBlob(protectedPdf, fileName);
      
      toast({
        title: "Protection complete",
        description: `Successfully protected ${file.name} with a password.`
      });
      
      // Increment conversion count
      incrementConversion();
      
      // Reset password fields
      setPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error('Error protecting PDF:', error);
      toast({
        variant: "destructive",
        title: "Protection failed",
        description: "An error occurred while adding password protection. Please try again."
      });
    } finally {
      setIsProtecting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-zenith-100 p-4 rounded-full">
              <Lock size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Protect PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Add password protection to your sensitive PDF documents.
          </p>
        </div>
      </section>
      
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            {!isProtecting ? (
              <>
                <FileUpload
                  onFilesSelected={handleFileChange}
                  acceptedFileTypes=".pdf"
                  maxFiles={1}
                  currentFiles={file ? [file] : []}
                />
                
                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleProtect} 
                    disabled={!file || !password}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Protect PDF
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to password protect PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Enter a password and confirm it.</li>
                    <li>Click the "Protect PDF" button.</li>
                    <li>Download your password-protected PDF.</li>
                  </ol>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                    <p className="font-medium">Important:</p>
                    <p>Make sure to remember your password. If you forget it, you may not be able to access your document.</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Protect PDF" 
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

export default ProtectPdf;
