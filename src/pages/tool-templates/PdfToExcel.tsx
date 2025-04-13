
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileSpreadsheet } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

const PdfToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
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
  
  const handleConvert = async () => {
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
        title: "Conversion limit reached",
        description: "Please sign up to convert more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Convert PDF to Excel
      const excelBlob = await PDFService.pdfToExcel(file, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '.xlsx');
      
      // Download the Excel file
      PDFService.downloadBlob(excelBlob, fileName);
      
      toast({
        title: "Conversion complete",
        description: `Successfully converted ${file.name} to Excel format.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error converting PDF to Excel:', error);
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
              <FileSpreadsheet size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">PDF to Excel Converter</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Extract tables from your PDF documents to Excel spreadsheets.
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
                  accept=".pdf"
                  maxFiles={1}
                  currentFiles={file ? [file] : []}
                />
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleConvert} 
                    disabled={!file}
                    className="bg-zenith-500 hover:bg-zenith-600"
                    size="lg"
                  >
                    Convert to Excel
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to convert PDF to Excel</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document containing tables.</li>
                    <li>Click the "Convert to Excel" button.</li>
                    <li>Wait for the conversion to complete.</li>
                    <li>Download your Excel spreadsheet.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="PDF to Excel" 
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

export default PdfToExcel;
