
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
  Lock,
  FileSpreadsheet,
  Presentation,
  Edit,
  SlidersHorizontal,
  Unlock,
  Stamp,
  RotateCw,
  Globe,
  Search,
  ListFilter
} from 'lucide-react';

const Tools = () => {
  // Group tools by category
  const toolCategories = [
    {
      title: "Convert From PDF",
      tools: [
        { title: "PDF to Word", description: "Convert PDF to editable Word documents", icon: FileText, path: "/tools/pdf-to-word" },
        { title: "PDF to PowerPoint", description: "Convert PDF to editable PowerPoint presentations", icon: Presentation, path: "/tools/pdf-to-ppt" },
        { title: "PDF to Excel", description: "Extract tables from PDFs into Excel spreadsheets", icon: FileSpreadsheet, path: "/tools/pdf-to-excel" },
        { title: "PDF to JPG", description: "Convert each PDF page to a JPG image", icon: ImagePlus, path: "/tools/pdf-to-jpg" }
      ]
    },
    {
      title: "Convert To PDF",
      tools: [
        { title: "Word to PDF", description: "Convert Word documents to PDF", icon: FilePlus, path: "/tools/word-to-pdf" },
        { title: "PowerPoint to PDF", description: "Convert PowerPoint presentations to PDF", icon: Presentation, path: "/tools/ppt-to-pdf" },
        { title: "Excel to PDF", description: "Convert Excel spreadsheets to PDF", icon: FileSpreadsheet, path: "/tools/excel-to-pdf" },
        { title: "JPG to PDF", description: "Convert JPG images to PDF", icon: FileOutput, path: "/tools/jpg-to-pdf" },
        { title: "HTML to PDF", description: "Convert webpages to PDF", icon: Globe, path: "/tools/html-to-pdf" }
      ]
    },
    {
      title: "Edit & Manage PDF",
      tools: [
        { title: "Merge PDF", description: "Combine multiple PDFs into one", icon: Combine, path: "/tools/merge-pdf" },
        { title: "Split PDF", description: "Extract pages from PDFs", icon: Scissors, path: "/tools/split-pdf" },
        { title: "Compress PDF", description: "Reduce PDF file size", icon: Minimize2, path: "/tools/compress-pdf" },
        { title: "Edit PDF", description: "Add text, images, and shapes to PDFs", icon: Edit, path: "/tools/edit-pdf" },
        { title: "Organize PDF", description: "Rearrange, delete or add PDF pages", icon: ListFilter, path: "/tools/organize-pdf" }
      ]
    },
    {
      title: "PDF Security",
      tools: [
        { title: "Protect PDF", description: "Add password protection to PDFs", icon: Lock, path: "/tools/protect-pdf" },
        { title: "Unlock PDF", description: "Remove password protection from PDFs", icon: Unlock, path: "/tools/unlock-pdf" },
        { title: "Watermark PDF", description: "Add watermarks to PDFs", icon: Stamp, path: "/tools/watermark-pdf" }
      ]
    },
    {
      title: "Other Tools",
      tools: [
        { title: "Rotate PDF", description: "Rotate PDF pages", icon: RotateCw, path: "/tools/rotate-pdf" },
        { title: "OCR PDF", description: "Make scanned PDFs searchable", icon: Search, path: "/tools/ocr-pdf" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-12 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">All PDF Tools</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Everything you need to work with PDFs in one place.
            100% free and easy to use.
          </p>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          {toolCategories.map((category, index) => (
            <div key={index} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-100">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <ToolCard 
                    key={toolIndex}
                    title={tool.title}
                    description={tool.description}
                    icon={tool.icon}
                    path={tool.path}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Tools;
