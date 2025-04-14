
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import ConversionProgress from '@/components/ConversionProgress';
import { Download, AlertCircle } from 'lucide-react';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/lib/api-service';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const PdfToWord = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ file: File; blob: Blob; }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [conversionError, setConversionError] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { canConvert, incrementConversion, showLoginPrompt, refreshUserData, isServerConnected } = useConversion();
  const [user] = useLocalStorage<User | null>('pdfZenithUser', null);

  useEffect(() => {
    if (user) {
      refreshUserData();
    }
  }, [user, refreshUserData]);

  const handleFileSelect = (files: File[]) => {
    // Filter for PDF files only
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Please select PDF files only."
      });
    }
    
    setSelectedFiles(pdfFiles);
    setConvertedFiles([]);
    setProgress(0);
    setConversionStatus('processing');
    setConversionError('');
  };

  const handleConvert = async () => {
    if (!selectedFiles.length) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one PDF file to convert."
      });
      return;
    }
    
    if (!canConvert && !user && isServerConnected) {
      showLoginPrompt();
      setLoginDialogOpen(true);
      return;
    }

    setProcessing(true);
    setConversionStatus('processing');
    setProgress(0);
    
    try {
      const results = [];
      
      for (const file of selectedFiles) {
        try {
          const blob = await PDFService.pdfToWord(file, (progressValue) => {
            setProgress(Math.round(progressValue));
          });
          
          if (!blob) {
            throw new Error('Conversion failed - no output received');
          }
          
          const convertedFile = new File([blob], file.name.replace('.pdf', '.docx'), {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });
          
          results.push({ file: convertedFile, blob });
        } catch (fileError) {
          console.error('Error converting file:', fileError);
          setConversionStatus('error');
          setConversionError(`Error converting file: ${file.name}`);
          throw fileError;
        }
      }
      
      if (results.length > 0) {
        setConvertedFiles(results);
        setConversionStatus('success');
        incrementConversion();
        
        toast({
          title: "Conversion successful",
          description: `Successfully converted ${results.length} file(s)`
        });
      } else {
        throw new Error('No files were converted successfully');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionStatus('error');
      setConversionError('An error occurred during conversion');
      
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "There was an error converting your file. Please try again."
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (blob: Blob, fileName: string) => {
    PDFService.downloadBlob(blob, fileName);
  };

  const handleDownloadAll = () => {
    convertedFiles.forEach(({ blob, file }) => {
      PDFService.downloadBlob(blob, file.name);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation openLoginDialog={loginDialogOpen} setOpenLoginDialog={setLoginDialogOpen} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">PDF to Word Converter</h1>
          <p className="text-zinc-600 mb-8">
            Convert your PDF documents to editable Word files with high accuracy.
          </p>
          
          {!isServerConnected && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                Could not connect to Supabase. Operating in offline mode with limited features.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
            
            <FileUpload
              acceptedFileTypes=".pdf"
              onFilesSelected={handleFileSelect}
              className="mb-6"
              currentFiles={selectedFiles}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleConvert} 
                disabled={!selectedFiles.length || processing}
                className="bg-zenith-500 hover:bg-zenith-600"
              >
                {processing ? 'Converting...' : 'Convert to Word'}
              </Button>
            </div>
          </div>
          
          {(processing || convertedFiles.length > 0 || conversionStatus === 'error') && (
            <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Conversion Results</h2>
              
              {processing && (
                <ConversionProgress
                  status="processing"
                  progress={progress}
                  fileName={selectedFiles[0]?.name || 'File'}
                  conversionType="PDF to Word"
                  className="mb-4"
                />
              )}
              
              {conversionStatus === 'error' && (
                <ConversionProgress
                  status="error"
                  progress={progress}
                  fileName={selectedFiles[0]?.name || 'File'}
                  errorMessage={conversionError}
                  className="mb-4"
                />
              )}
              
              {convertedFiles.length > 0 && (
                <div className="space-y-4">
                  {convertedFiles.map(({ file, blob }, index) => (
                    <div key={index} className="flex items-center justify-between bg-zenith-50/50 p-3 rounded-lg">
                      <span className="font-medium">{file.name}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(blob, file.name)}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </div>
                  ))}
                  
                  {convertedFiles.length > 1 && (
                    <div className="pt-4 flex justify-end">
                      <Button onClick={handleDownloadAll} className="bg-zenith-500 hover:bg-zenith-600">
                        <Download className="w-4 h-4 mr-2" /> Download All
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PdfToWord;
