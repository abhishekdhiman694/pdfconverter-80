
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Step {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps: Step[] = [
    {
      target: '.upload-button',
      title: 'Welcome to PDF Tools!',
      content: 'This guided tour will show you how to use our site effectively. Let\'s start with uploading files.',
      placement: 'bottom',
    },
    {
      target: '.popular-tools',
      title: 'Popular Tools',
      content: 'Here you can see our most popular PDF tools. You can convert, compress, and edit PDFs easily.',
      placement: 'top',
    },
    {
      target: '.pdf-to-word-tool',
      title: 'Convert PDF to Word',
      content: 'Try our PDF to Word converter - one of our most popular tools!',
      placement: 'bottom',
    },
    {
      target: '.file-upload-area',
      title: 'Upload Your Files',
      content: 'Simply drag and drop your files here or click to browse your computer.',
      placement: 'bottom',
    },
    {
      target: '.features-section',
      title: 'Powerful Features',
      content: 'Explore all our powerful features designed to help you work with PDFs efficiently.',
      placement: 'top',
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    
    // Scroll to the target element of the current step
    const scrollToTarget = () => {
      const targetElement = document.querySelector(steps[currentStep].target);
      
      if (targetElement) {
        // Add highlight class
        targetElement.classList.add('tour-highlight');
        
        // Scroll to the element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        
        // If we're on the PDF to Word tool step, navigate to that page
        if (currentStep === 2 && window.location.pathname !== '/tools/pdf-to-word') {
          navigate('/tools/pdf-to-word');
        }
      }
    };
    
    // Remove highlight from all elements first
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Small delay to ensure DOM is ready and any navigation has completed
    const timeoutId = setTimeout(scrollToTarget, 300);
    
    return () => {
      clearTimeout(timeoutId);
      // Clean up highlight classes when unmounting
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, isOpen, navigate, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose}></div>
      
      <div 
        className={`fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-sm pointer-events-auto
                   ${step.placement === 'top' ? 'mb-3 bottom-full' : 
                     step.placement === 'bottom' ? 'mt-3 top-full' : 
                     step.placement === 'left' ? 'mr-3 right-full' : 
                     'ml-3 left-full'}`}
        style={{
          // We'll adjust this positioning with JS in a real implementation
          // This is just a placeholder
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          aria-label="Close tour"
        >
          <X size={16} />
        </button>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
          <p className="text-gray-600">{step.content}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrevious}
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
            )}
            
            <Button 
              size="sm"
              onClick={handleNext}
              className="bg-zenith-500 hover:bg-zenith-600"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep !== steps.length - 1 && <ChevronRight size={16} className="ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
