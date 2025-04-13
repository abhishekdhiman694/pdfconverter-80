
import React, { useState } from 'react';
import { ArrowRight, FileText, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import FileUpload from '@/components/FileUpload';
import { toast } from '@/components/ui/use-toast';

const Hero = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingComplete, setProcessingComplete] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setProgress(0);
    setSelectedFiles([]);
    setProcessingComplete(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetFlow();
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one file to continue."
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(prevStep => prevStep + 1);
      
      // If moving to processing step, start the progress simulation
      if (currentStep === 1) {
        simulateProcessing();
      }
    } else {
      // Flow complete, close dialog
      handleCloseDialog();
      toast({
        title: "Success",
        description: "Your files have been processed successfully!"
      });
    }
  };

  const simulateProcessing = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setProcessingComplete(true);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 200);
  };

  const scrollToPopularTools = () => {
    const popularToolsSection = document.querySelector('.popular-tools');
    if (popularToolsSection) {
      popularToolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zenith-100/40 to-white/80 z-0"></div>
      
      {/* Animated shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-zenith-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-zenith-800 to-zenith-500 bg-clip-text text-transparent">
            Every PDF Tool You Need In One Place
          </h1>
          <p className="text-xl text-zinc-600 mb-8 md:px-12">
            Convert, edit, merge, split, compress PDFs with just a few clicks. 
            100% free and easy to use with the highest quality results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="bg-zenith-500 hover:bg-zenith-600 text-lg py-6 px-8 rounded-xl"
              onClick={scrollToPopularTools}
            >
              Get Started
            </Button>
            <Button variant="outline" className="text-lg py-6 px-8 rounded-xl">
              <Link to="/tools" className="flex items-center">
                Explore All Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-zinc-100 max-w-3xl mx-auto popular-tools">
            <div className="flex items-center justify-center gap-3 text-zinc-500 mb-4">
              <FileText size={20} />
              <span className="text-sm">Over 20 powerful PDF tools to help you work more efficiently</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {['PDF to Word', 'Merge PDF', 'Split PDF', 'JPG to PDF', 'Compress', 'PDF to JPG'].map((tool, index) => (
                <Link 
                  to={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`} 
                  key={index} 
                  className={`text-xs sm:text-sm p-2 bg-zenith-50 hover:bg-zenith-100 rounded text-center text-zenith-700 transition-colors ${tool === 'PDF to Word' ? 'pdf-to-word-tool' : ''}`}
                >
                  {tool}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-step upload dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {currentStep === 1 && "Step 1: Select Your Files"}
              {currentStep === 2 && "Step 2: Processing Files"}
              {currentStep === 3 && "Step 3: Ready to Download"}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-full flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-zenith-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`h-1 flex-1 ${currentStep > 1 ? 'bg-zenith-500' : 'bg-gray-200'}`}></div>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-zenith-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className={`h-1 flex-1 ${currentStep > 2 ? 'bg-zenith-500' : 'bg-gray-200'}`}></div>
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 3 ? 'bg-zenith-500 text-white' : 'bg-gray-200'}`}>
                3
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="py-4">
            {currentStep === 1 && (
              <div className="mb-4 file-upload-area">
                <p className="text-zinc-600 mb-4">
                  Upload your files to get started. We support PDF, Word, Excel, PowerPoint, and image formats.
                </p>
                <FileUpload 
                  acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onFilesSelected={handleFilesSelected}
                  className="w-full"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <p className="text-zinc-600 mb-2">
                  We're processing your files. This may take a moment...
                </p>
                <Progress value={progress} className="w-full h-2" />
                <p className="text-sm text-zinc-500">
                  {processingComplete ? 'Processing complete!' : `Processing... ${progress}%`}
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-center">All Done!</h3>
                <p className="text-zinc-600 text-center">
                  Your files are ready to download. You can also choose to convert them to another format.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="px-3 py-1 bg-zenith-50 rounded-full text-sm text-zenith-700">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step actions */}
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={handleCloseDialog}
              className="mr-2"
            >
              {currentStep === 3 ? "Close" : "Cancel"}
            </Button>
            <Button 
              onClick={handleNextStep}
              className="bg-zenith-500 hover:bg-zenith-600"
              disabled={currentStep === 2 && !processingComplete}
            >
              {currentStep === 3 ? "Download" : "Next"}
              {currentStep !== 3 && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hero;
