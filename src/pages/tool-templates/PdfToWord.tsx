import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ConversionProgress from '@/components/ConversionProgress';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { useConversion } from '@/contexts/ConversionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';

const PdfToWord = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { canConvert, incrementConversion } = useConversion();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [user] = useLocalStorage('pdfZenithUser', null);
  const [openGlobalLoginDialog, setOpenGlobalLoginDialog] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Only PDF files are accepted for this conversion."
      });
    }
    
    setSelectedFiles(pdfFiles);
  };

  const handleConvert = () => {
    if (!canConvert && !user) {
      setShowLoginDialog(true);
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one PDF file to convert."
      });
      return;
    }
    
    incrementConversion();
    
    setConverting(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setConverting(false);
          
          const converted = selectedFiles.map(file => 
            file.name.replace('.pdf', '.docx')
          );
          setConvertedFiles(converted);
          
          toast({
            title: "Conversion complete",
            description: `Successfully converted ${selectedFiles.length} file(s).`
          });
          
          return 100;
        }
        return prevProgress + 5;
      });
    }, 200);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your converted files will be downloaded shortly."
    });
  };

  const handleLoginDialogOpen = () => {
    setShowLoginDialog(false);
    setOpenGlobalLoginDialog(true);
    
    const event = new CustomEvent('openLoginDialog');
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation openLoginDialog={openGlobalLoginDialog} setOpenLoginDialog={setOpenGlobalLoginDialog} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">PDF to Word Converter</h1>
              <p className="text-zinc-600">
                Convert your PDF files to editable Word documents with high accuracy.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {!convertedFiles.length ? (
                <>
                  <div className="mb-6">
                    <FileUpload 
                      acceptedFileTypes=".pdf" 
                      onFilesSelected={handleFilesSelected} 
                      maxFiles={3}
                    />
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Selected Files</h3>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center bg-zinc-50 p-2 rounded">
                            <FileText className="h-5 w-5 text-zinc-500 mr-2" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-zinc-500 ml-auto">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {converting ? (
                    <div className="mb-6">
                      <ConversionProgress 
                        progress={progress} 
                        status="processing"
                        fileName={selectedFiles.length > 0 ? selectedFiles[0].name : "File"}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleConvert}
                        className="bg-zenith-500 hover:bg-zenith-600 px-8"
                        disabled={selectedFiles.length === 0}
                      >
                        Convert to Word
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Conversion Complete!</h3>
                  <p className="text-zinc-600 mb-6">
                    Your PDF files have been successfully converted to Word format.
                  </p>
                  <div className="mb-6 max-w-md mx-auto">
                    <h4 className="font-medium mb-2 text-left">Converted Files</h4>
                    <div className="space-y-2">
                      {convertedFiles.map((file, index) => (
                        <div key={index} className="flex items-center bg-zinc-50 p-2 rounded">
                          <FileText className="h-5 w-5 text-zinc-500 mr-2" />
                          <span className="text-sm truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleDownload}
                      className="bg-zenith-500 hover:bg-zenith-600"
                    >
                      <Download className="mr-2 h-5 w-5" /> Download All
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFiles([]);
                        setConvertedFiles([]);
                      }}
                    >
                      Convert Another File
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">How to Convert PDF to Word</h2>
              <ol className="list-decimal pl-5 space-y-2 text-zinc-600">
                <li>Upload your PDF file(s) using the file uploader above.</li>
                <li>Click the "Convert to Word" button to start the conversion process.</li>
                <li>Wait for the conversion to complete.</li>
                <li>Download your converted Word document.</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Login Required
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              You've used your free conversion. Please log in or sign up to continue using our PDF conversion tools.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>Cancel</Button>
            <Button 
              className="bg-zenith-500 hover:bg-zenith-600"
              onClick={handleLoginDialogOpen}
            >
              Login / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PdfToWord;
