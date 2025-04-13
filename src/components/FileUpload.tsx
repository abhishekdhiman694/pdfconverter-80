
import React, { useState, useRef } from 'react';
import { Upload, FileIcon, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes: string;
  maxFiles?: number;
  className?: string;
  currentFiles?: File[];
  multiple?: boolean;
}

const FileUpload = ({ 
  acceptedFileTypes, 
  maxFiles = 10,
  onFilesSelected,
  className,
  currentFiles = [],
  multiple = false
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>(currentFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(Array.from(event.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You can only upload up to ${maxFiles} files at once.`
      });
      return;
    }

    // Filter files by accepted types
    const validFiles = newFiles.filter(file => {
      const isValidType = new RegExp(acceptedFileTypes).test(file.type);
      if (!isValidType) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `File type not supported: ${file.name}`
        });
      }
      return isValidType;
    });

    setFiles(prev => [...prev, ...validFiles]);
    onFilesSelected([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      onFilesSelected(newFiles);
      return newFiles;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        multiple={multiple && maxFiles > 1}
        className="hidden"
      />
      
      <div 
        className={cn(
          "drop-area border-2 border-dashed border-zinc-200 rounded-lg p-4 cursor-pointer transition-colors",
          isDragging && "border-zenith-500 bg-zenith-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 rounded-full bg-zenith-100 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-zenith-500" />
          </div>
          
          <h3 className="font-medium text-lg mb-2">Drag & Drop Files Here</h3>
          <p className="text-zinc-500 text-sm mb-4">or click to browse your files</p>
          
          <Button type="button" className="bg-zenith-500 hover:bg-zenith-600">
            Select Files
          </Button>
          
          <p className="text-xs text-zinc-400 mt-4">
            Supported formats: {acceptedFileTypes.replace(/\./g, '').replace(/,/g, ', ')}
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Selected Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-zinc-100">
                <div className="flex items-center">
                  <div className="p-2 bg-zenith-50 rounded-md mr-3">
                    <FileText className="w-5 h-5 text-zenith-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    removeFile(index); 
                  }}
                  className="text-zinc-400 hover:text-red-500"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
