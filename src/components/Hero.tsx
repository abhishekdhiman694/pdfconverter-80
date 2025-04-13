
import React from 'react';
import { ArrowRight, FileText, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
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
            <Button className="bg-zenith-500 hover:bg-zenith-600 text-lg py-6 px-8 rounded-xl">
              <FileUp className="mr-2 h-5 w-5" /> Upload Files
            </Button>
            <Button variant="outline" className="text-lg py-6 px-8 rounded-xl">
              <Link to="/tools" className="flex items-center">
                Explore All Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-zinc-100 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-zinc-500 mb-4">
              <FileText size={20} />
              <span className="text-sm">Over 20 powerful PDF tools to help you work more efficiently</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {['PDF to Word', 'Merge PDF', 'Split PDF', 'JPG to PDF', 'Compress', 'PDF to JPG'].map((tool, index) => (
                <Link to={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`} key={index} className="text-xs sm:text-sm p-2 bg-zenith-50 hover:bg-zenith-100 rounded text-center text-zenith-700 transition-colors">
                  {tool}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
