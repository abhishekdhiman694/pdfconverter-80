
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ListFilter } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const OrganizePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { canConvert, incrementConversion } = useConversion();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = async (files: File[]) => {
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
      setIsLoading(true);
      
      try {
        // Load the PDF document to get page count
        const arrayBuffer = await files[0].arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        setTotalPages(numPages);
        // Initialize page order to sequential order
        setPageOrder(Array.from({ length: numPages }, (_, i) => i));
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          variant: "destructive",
          title: "Error loading PDF",
          description: "Could not load the PDF file. Please try another file."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const movePageUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...pageOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setPageOrder(newOrder);
    }
  };

  const movePageDown = (index: number) => {
    if (index < pageOrder.length - 1) {
      const newOrder = [...pageOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setPageOrder(newOrder);
    }
  };

  const deletePage = (index: number) => {
    const newOrder = [...pageOrder];
    newOrder.splice(index, 1);
    setPageOrder(newOrder);
  };
  
  const handleOrganize = async () => {
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
        title: "Organization limit reached",
        description: "Please sign up to organize more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Organize PDF
      const pdfBlob = await PDFService.organizePdf(file, pageOrder, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_organized.pdf');
      
      // Download the organized PDF file
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "Organization complete",
        description: `Successfully organized ${file.name}.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error organizing PDF:', error);
      toast({
        variant: "destructive",
        title: "Organization failed",
        description: "An error occurred during organization. Please try again."
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
              <ListFilter size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Organize PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Rearrange, delete, or reorder pages in your PDF document.
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
                
                {file && totalPages > 0 && !isLoading && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Page Order</h3>
                    
                    <div className="space-y-2">
                      {pageOrder.map((pageIndex, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <span className="font-medium">Page {pageIndex + 1}</span> (new position: {i + 1})
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => movePageUp(i)}
                              disabled={i === 0}
                            >
                              ↑
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => movePageDown(i)}
                              disabled={i === pageOrder.length - 1}
                            >
                              ↓
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deletePage(i)}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleOrganize} 
                      className="bg-zenith-500 hover:bg-zenith-600 mt-4"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
                
                {isLoading && (
                  <div className="text-center py-8">
                    <p>Analyzing PDF structure...</p>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to organize PDF pages</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Rearrange the pages using the up and down arrows.</li>
                    <li>Delete unwanted pages using the X button.</li>
                    <li>Click the "Save Changes" button.</li>
                    <li>Download your organized PDF.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Organizing PDF" 
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

export default OrganizePdf;
