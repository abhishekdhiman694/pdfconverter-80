import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import ConversionProgress from '@/components/ConversionProgress';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, ArrowDown, ArrowUp, ArrowRight, Download, Combine, GripVertical, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [merged, setMerged] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setMerging(false);
    setMerged(false);
    setProgress(0);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (files.length <= 1) return;
    
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < files.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = () => {
    if (files.length < 2) {
      toast.error('Please select at least two PDF files to merge');
      return;
    }

    setMerging(true);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setMerging(false);
        setMerged(true);
        toast.success('PDF files merged successfully!');
      }
    }, 200);
  };

  const handleDownload = () => {
    toast.success('Your merged PDF would now download.');
    
    setFiles([]);
    setMerged(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-3 bg-zenith-100 rounded-xl mb-4">
            <Combine className="w-8 h-8 text-zenith-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Merge PDF Files</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Combine multiple PDF files into a single document. 
            Arrange pages in any order before merging.
          </p>
        </div>
      </section>
      
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Upload PDF Files</h2>
                <FileUpload 
                  acceptedFileTypes=".pdf"
                  onFilesSelected={handleFilesSelected}
                />
                
                {files.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">File Order (Drag to Reorder)</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 bg-white border border-zinc-100 p-3 rounded-lg"
                        >
                          <GripVertical className="text-zinc-400 w-5 h-5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-zinc-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn("text-zinc-400 hover:text-zinc-600", {
                                "opacity-50 cursor-not-allowed": index === 0
                              })}
                              onClick={() => moveFile(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn("text-zinc-400 hover:text-zinc-600", {
                                "opacity-50 cursor-not-allowed": index === files.length - 1
                              })}
                              onClick={() => moveFile(index, 'down')}
                              disabled={index === files.length - 1}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-zinc-400 hover:text-red-500"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-zinc-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Merge Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max Files</span>
                    <span className="text-sm font-medium">20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max File Size</span>
                    <span className="text-sm font-medium">100 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Output Format</span>
                    <span className="text-sm font-medium">PDF</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleMerge}
                      disabled={files.length < 2 || merging}
                      className="w-full bg-zenith-500 hover:bg-zenith-600"
                    >
                      {merging ? 'Merging...' : 'Merge PDFs'}
                      {!merging && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {(merging || merged) && (
              <div className="mt-8 border-t border-zinc-100 pt-8">
                <h2 className="text-xl font-semibold mb-4">Merging Progress</h2>
                
                <div className="space-y-4">
                  <ConversionProgress 
                    status={merged ? 'success' : 'processing'}
                    progress={progress}
                    fileName="Merged PDF"
                  />
                  
                  {merged && (
                    <div className="flex justify-end mt-6">
                      <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 w-4 h-4" />
                        Download Merged PDF
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">How to Merge PDF Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-zenith-600">1</span>
                </div>
                <h3 className="font-medium mb-2">Upload PDF Files</h3>
                <p className="text-zinc-500 text-sm">
                  Select multiple PDF files that you want to combine or drag & drop them.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-zenith-600">2</span>
                </div>
                <h3 className="font-medium mb-2">Arrange Files</h3>
                <p className="text-zinc-500 text-sm">
                  Arrange the order of the PDF files before merging. Use the up and down arrows to change positions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-zenith-600">3</span>
                </div>
                <h3 className="font-medium mb-2">Merge and Download</h3>
                <p className="text-zinc-500 text-sm">
                  Click the "Merge PDFs" button and then download your combined PDF document.
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
                  All merged PDFs maintain their original quality and content. Password-protected PDFs cannot be merged without removing the password first.
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

export default MergePdf;
