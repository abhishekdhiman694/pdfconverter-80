
import React from 'react';
import { Link } from 'react-router-dom';
import { FileDigit, Github, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-zinc-100 py-12 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-md bg-gradient-to-br from-zenith-500 to-zenith-700 text-white">
                <FileDigit size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">PDF Zenith</span>
            </Link>
            <p className="text-zinc-500 mb-4">
              Every tool you need to work with PDFs in one place, 100% free and easy to use.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-zenith-500">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-zenith-500">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-zenith-500">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-800">Convert From PDF</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/pdf-to-word" className="text-zinc-500 hover:text-zenith-500">PDF to Word</Link></li>
              <li><Link to="/tools/pdf-to-ppt" className="text-zinc-500 hover:text-zenith-500">PDF to PowerPoint</Link></li>
              <li><Link to="/tools/pdf-to-excel" className="text-zinc-500 hover:text-zenith-500">PDF to Excel</Link></li>
              <li><Link to="/tools/pdf-to-jpg" className="text-zinc-500 hover:text-zenith-500">PDF to JPG</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-800">Convert To PDF</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/word-to-pdf" className="text-zinc-500 hover:text-zenith-500">Word to PDF</Link></li>
              <li><Link to="/tools/ppt-to-pdf" className="text-zinc-500 hover:text-zenith-500">PowerPoint to PDF</Link></li>
              <li><Link to="/tools/excel-to-pdf" className="text-zinc-500 hover:text-zenith-500">Excel to PDF</Link></li>
              <li><Link to="/tools/jpg-to-pdf" className="text-zinc-500 hover:text-zenith-500">JPG to PDF</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-zinc-800">PDF Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/merge-pdf" className="text-zinc-500 hover:text-zenith-500">Merge PDF</Link></li>
              <li><Link to="/tools/split-pdf" className="text-zinc-500 hover:text-zenith-500">Split PDF</Link></li>
              <li><Link to="/tools/compress-pdf" className="text-zinc-500 hover:text-zenith-500">Compress PDF</Link></li>
              <li><Link to="/tools/protect-pdf" className="text-zinc-500 hover:text-zenith-500">Protect PDF</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-200 text-center text-zinc-500">
          <p className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span>&copy; {new Date().getFullYear()} PDF Zenith. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-medium text-zenith-600">Powered by Bilvine</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
