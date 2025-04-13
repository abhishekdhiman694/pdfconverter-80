
import React from 'react';
import { Link } from 'react-router-dom';
import { FileDigit, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="py-4 border-b border-zinc-100">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gradient-to-br from-zenith-500 to-zenith-700 text-white">
            <FileDigit size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">PDF Zenith</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-zenith-700 hover:text-zenith-500 font-medium">Home</Link>
          <Link to="/tools" className="text-zenith-700 hover:text-zenith-500 font-medium">All Tools</Link>
          <Link to="/about" className="text-zenith-700 hover:text-zenith-500 font-medium">About</Link>
          <Button className="bg-zenith-500 hover:bg-zenith-600">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMenu} 
          className="md:hidden text-zenith-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "fixed inset-0 z-50 bg-white p-6 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="p-2 rounded-md bg-gradient-to-br from-zenith-500 to-zenith-700 text-white">
                <FileDigit size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">PDF Zenith</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X size={24} />
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            <Link to="/" className="text-xl font-medium p-2" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/tools" className="text-xl font-medium p-2" onClick={() => setIsOpen(false)}>All Tools</Link>
            <Link to="/about" className="text-xl font-medium p-2" onClick={() => setIsOpen(false)}>About</Link>
            <Button className="bg-zenith-500 hover:bg-zenith-600 mt-4" onClick={() => setIsOpen(false)}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
