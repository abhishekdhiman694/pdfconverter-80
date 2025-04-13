
import React from 'react';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/FeaturesSection';
import ToolCard from '@/components/ToolCard';
import { 
  FileText, 
  FilePlus, 
  Scissors, 
  ImagePlus, 
  FileOutput, 
  Combine,
  Minimize2,
  Table2,
  Lock
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular PDF Tools</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Choose from our most popular PDF tools to convert, compress, and edit your files.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard 
              title="PDF to Word" 
              description="Convert PDF to editable Word documents with high accuracy"
              icon={FileText}
              path="/tools/pdf-to-word"
            />
            <ToolCard 
              title="Word to PDF" 
              description="Convert Word documents to PDF with perfect formatting"
              icon={FilePlus}
              path="/tools/word-to-pdf"
            />
            <ToolCard 
              title="PDF to JPG" 
              description="Convert each PDF page to a JPG image or extract images"
              icon={ImagePlus}
              path="/tools/pdf-to-jpg"
            />
            <ToolCard 
              title="JPG to PDF" 
              description="Convert JPG images to PDF documents quickly"
              icon={FileOutput}
              path="/tools/jpg-to-pdf"
            />
            <ToolCard 
              title="Merge PDF" 
              description="Combine multiple PDFs into a single document"
              icon={Combine}
              path="/tools/merge-pdf"
            />
            <ToolCard 
              title="Split PDF" 
              description="Extract pages or split PDFs into multiple files"
              icon={Scissors}
              path="/tools/split-pdf"
            />
            <ToolCard 
              title="Compress PDF" 
              description="Reduce file size while maintaining quality"
              icon={Minimize2}
              path="/tools/compress-pdf"
            />
            <ToolCard 
              title="PDF to Excel" 
              description="Extract tables from PDFs into Excel spreadsheets"
              icon={Table2}
              path="/tools/pdf-to-excel"
            />
            <ToolCard 
              title="Protect PDF" 
              description="Add password protection to your sensitive PDFs"
              icon={Lock}
              path="/tools/protect-pdf"
            />
          </div>
        </div>
      </section>
      
      <div className="features-section">
        <FeaturesSection />
      </div>
      
      <section className="py-20 bg-zenith-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Convert Your Files?</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto mb-8">
            Start using our free PDF tools today. No registration required.
          </p>
          <a 
            href="/tools" 
            className="inline-block bg-zenith-500 hover:bg-zenith-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
