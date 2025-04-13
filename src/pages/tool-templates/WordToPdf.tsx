
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ConversionProgress from '@/components/ConversionProgress';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, ArrowRight, Download, FileText } from 'lucide-react';

const WordToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    // Reset states when new files are selected
    setConverting(false);
    setConverted(false);
    setProgress(0);
  };

  const handleConvert = () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to convert');
      return;
    }

    setConverting(true);
    
    // Simulate conversion progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setConverting(false);
        setConverted(true);
        toast.success('Conversion completed successfully!');
      }
    }, 200);
  };

  const handleDownload = () => {
    // In a real app, this would download the converted file
    toast.success('Your file would now download.');
    
    // Reset for new conversion
    setFiles([]);
    setConverted(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-3 bg-zenith-100 rounded-xl mb-4">
            <FileText className="w-8 h-8 text-zenith-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Word to PDF Converter</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Convert Word documents (DOC, DOCX) to PDF. 
            Preserve formatting and create high-quality PDF files.
          </p>
        </div>
      </section>
      
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
                <FileUpload 
                  acceptedFileTypes=".doc,.docx"
                  onFilesSelected={handleFilesSelected}
                />
              </div>
              
              <div className="bg-zinc-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Conversion Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PDF Quality</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max File Size</span>
                    <span className="text-sm font-medium">100 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Include Fonts</span>
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleConvert}
                      disabled={files.length === 0 || converting}
                      className="w-full bg-zenith-500 hover:bg-zenith-600"
                    >
                      {converting ? 'Converting...' : 'Convert to PDF'}
                      {!converting && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {(converting || converted) && (
              <div className="mt-8 border-t border-zinc-100 pt-8">
                <h2 className="text-xl font-semibold mb-4">Conversion Progress</h2>
                
                <div className="space-y-4">
                  {files.map((file, index) => (
                    <ConversionProgress 
                      key={index}
                      status={converted ? 'success' : 'processing'}
                      progress={progress}
                      fileName={file.name}
                    />
                  ))}
                  
                  {converted && (
                    <div className="flex justify-end mt-6">
                      <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 w-4 h-4" />
                        Download Converted Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">How to Convert Word to PDF</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-zenith-600">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload Word Files</h3>
                <p className="text-zinc-500 text-sm">
                  Select the Word documents (DOC or DOCX) you want to convert or drag & drop them.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-zenith-600">2</span>
                </div>
                <h3 className="font-medium mb-2">Convert Word to PDF</h3>
                <p className="text-zinc-500 text-sm">
                  Click the "Convert to PDF" button and our system will convert your Word documents.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-zenith-600">3</span>
                </div>
                <h3 className="font-medium mb-2">Download PDF Files</h3>
                <p className="text-zinc-500 text-sm">
                  Download your converted PDF files individually or as a ZIP archive.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-xl border border-zinc-100">
            <div className="flex items-start gap-4">
              <div className="text-amber-500 mt-1">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Keep in Mind</h3>
                <p className="text-zinc-500 text-sm">
                  Our converter preserves most formatting, including fonts, tables, and images. However, for documents with complex layouts, you may need to check the output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WordToPdf;
