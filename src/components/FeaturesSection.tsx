
import React from 'react';
import { FileText, Lock, Upload, Download, Wand2, LayoutGrid } from 'lucide-react';

const features = [
  {
    icon: <Upload className="w-6 h-6 text-zenith-500" />,
    title: 'Easy Upload',
    description: 'Simply drag and drop your files or click to browse. Support for multiple file formats.'
  },
  {
    icon: <Wand2 className="w-6 h-6 text-zenith-500" />,
    title: 'High Quality Conversion',
    description: 'Our advanced algorithms ensure the highest quality output for all your conversions.'
  },
  {
    icon: <FileText className="w-6 h-6 text-zenith-500" />,
    title: 'Multiple Formats',
    description: 'Convert between PDF, Word, PowerPoint, Excel, JPG and many more formats.'
  },
  {
    icon: <Lock className="w-6 h-6 text-zenith-500" />,
    title: 'Secure Processing',
    description: 'Your files are encrypted during transfer and automatically deleted after processing.'
  },
  {
    icon: <LayoutGrid className="w-6 h-6 text-zenith-500" />,
    title: '20+ PDF Tools',
    description: 'Access all the tools you need for working with PDFs in one convenient place.'
  },
  {
    icon: <Download className="w-6 h-6 text-zenith-500" />,
    title: 'Free Downloads',
    description: 'Download your converted files instantly without any watermarks or limitations.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose PDF Zenith?</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Our platform offers powerful features to help you work with PDFs quickly and efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-zenith-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
