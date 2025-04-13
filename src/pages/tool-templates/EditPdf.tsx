
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Edit } from 'lucide-react';
import ConversionProgress from '@/components/ConversionProgress';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { PDFService } from '@/lib/pdf-service';
import { useConversion } from '@/contexts/ConversionContext';

// Define the TextEdit interface to match what's used in pdf-service.ts
interface TextEdit {
  text: string;
  x: number;
  y: number;
  page: number;
}

const EditPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { canConvert, incrementConversion } = useConversion();
  const [edits, setEdits] = useState<TextEdit[]>([
    { text: 'Sample Text', x: 50, y: 500, page: 0 }
  ]);
  
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

  const handleEditChange = (index: number, field: keyof TextEdit, value: string | number) => {
    const newEdits = [...edits];
    newEdits[index] = {
      ...newEdits[index],
      [field]: value
    };
    setEdits(newEdits);
  };

  const addEdit = () => {
    setEdits([...edits, { text: '', x: 50, y: 500, page: 0 }]);
  };

  const removeEdit = (index: number) => {
    const newEdits = [...edits];
    newEdits.splice(index, 1);
    setEdits(newEdits);
  };
  
  const handleEdit = async () => {
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
        title: "Edit limit reached",
        description: "Please sign up to edit more files."
      });
      return;
    }
    
    setIsConverting(true);
    setProgress(0);
    
    try {
      // Edit PDF
      const pdfBlob = await PDFService.editPdf(file, edits, setProgress);
      
      // Generate filename
      const fileName = file.name.replace('.pdf', '_edited.pdf');
      
      // Download the edited PDF file
      PDFService.downloadBlob(pdfBlob, fileName);
      
      toast({
        title: "Editing complete",
        description: `Successfully edited ${file.name}.`
      });
      
      // Increment conversion count
      incrementConversion();
      
    } catch (error) {
      console.error('Error editing PDF:', error);
      toast({
        variant: "destructive",
        title: "Editing failed",
        description: "An error occurred during editing. Please try again."
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
              <Edit size={32} className="text-zenith-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Edit PDF</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Add text to your PDF documents.
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
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Text to Add</h3>
                    
                    {edits.map((edit, index) => (
                      <div key={index} className="mb-6 p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`text-${index}`}>Text Content</Label>
                            <Input 
                              id={`text-${index}`}
                              value={edit.text} 
                              onChange={(e) => handleEditChange(index, 'text', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`page-${index}`}>Page Number</Label>
                            <Input 
                              id={`page-${index}`}
                              type="number" 
                              min="0"
                              value={edit.page} 
                              onChange={(e) => handleEditChange(index, 'page', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`x-${index}`}>X Position</Label>
                            <Input 
                              id={`x-${index}`}
                              type="number"
                              value={edit.x} 
                              onChange={(e) => handleEditChange(index, 'x', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`y-${index}`}>Y Position</Label>
                            <Input 
                              id={`y-${index}`}
                              type="number"
                              value={edit.y} 
                              onChange={(e) => handleEditChange(index, 'y', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline"
                          onClick={() => removeEdit(index)}
                          className="mt-2" 
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={addEdit}
                      >
                        Add More Text
                      </Button>
                      
                      <Button 
                        onClick={handleEdit}
                        className="bg-zenith-500 hover:bg-zenith-600"
                      >
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">How to edit PDF</h2>
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-700">
                    <li>Upload your PDF document.</li>
                    <li>Add text and specify the position coordinates.</li>
                    <li>Click the "Apply Changes" button.</li>
                    <li>Download your edited PDF.</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="py-12">
                <ConversionProgress 
                  progress={progress} 
                  fileName={file?.name || ''} 
                  conversionType="Editing PDF" 
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

export default EditPdf;
