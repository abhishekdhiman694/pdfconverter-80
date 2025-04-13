
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
import { PDFService } from '@/lib/pdf-service';

const WordToPdf = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; blob: Blob }[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { canConvert, incrementConversion } = useConversion();

  const handleFilesSelected = (files: File[]) => {
    const wordFiles = files.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.type === 'application/msword'
    );
    
    if (wordFiles.length !== files.length) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Only Word documents are accepted for this conversion."
      });
    }
    
    setSelectedFiles(wordFiles);
  };

  const handleConvert = async () => {
    if (!canConvert && !selectedFiles.length) {
      setShowLoginDialog(true);
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one Word document to convert."
      });
      return;
    }
    
    incrementConversion();
    setConverting(true);
    setProgress(0);
    
    try {
      const results = [];
      
      // Process each file
      for (const file of selectedFiles) {
        // Convert Word to PDF
        const blob = await PDFService.wordToPdf(file, (fileProgress) => {
          // Calculate overall progress (equal weight per file)
          const fileWeight = 1 / selectedFiles.length;
          const overallProgress = selectedFiles.indexOf(file) * fileWeight * 100 + fileProgress * fileWeight;
          setProgress(Math.round(overallProgress));
        });
        
        // Add to results
        results.push({
          name: file.name.replace(/\.docx?$/, '.pdf'),
          blob
        });
      }
      
      setConvertedFiles(results);
      toast({
        title: "Conversion complete",
        description: `Successfully converted ${results.length} file(s).`
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "An error occurred during conversion. Please try again."
      });
    } finally {
      setConverting(false);
      setProgress(100);
    }
  };

  const handleDownload = (file: { name: string; blob: Blob }) => {
    PDFService.downloadBlob(file.blob, file.name);
    toast({
      title: "Download started",
      description: `Downloading ${file.name}`
    });
  };

  const handleDownloadAll = () => {
    convertedFiles.forEach(file => {
      PDFService.downloadBlob(file.blob, file.name);
    });
    
    toast({
      title: "Download started",
      description: `Downloading ${convertedFiles.length} files`
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Word to PDF Converter</h1>
              <p className="text-zinc-600">
                Convert your Word documents to PDF format with perfect formatting.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {!convertedFiles.length ? (
                <>
                  <div className="mb-6">
                    <FileUpload 
                      acceptedFileTypes=".doc,.docx" 
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
                        Convert to PDF
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
                    Your Word documents have been successfully converted to PDF format.
                  </p>
                  <div className="mb-6 max-w-md mx-auto">
                    <h4 className="font-medium mb-2 text-left">Converted Files</h4>
                    <div className="space-y-2">
                      {convertedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-zinc-50 p-2 rounded">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-zinc-500 mr-2" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleDownloadAll}
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
              <h2 className="text-xl font-semibold mb-4">How to Convert Word to PDF</h2>
              <ol className="list-decimal pl-5 space-y-2 text-zinc-600">
                <li>Upload your Word document(s) using the file uploader above.</li>
                <li>Click the "Convert to PDF" button to start the conversion process.</li>
                <li>Wait for the conversion to complete.</li>
                <li>Download your converted PDF document.</li>
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
              onClick={() => {
                setShowLoginDialog(false);
                const event = new CustomEvent('openLoginDialog');
                window.dispatchEvent(event);
              }}
            >
              Log In / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WordToPdf;
