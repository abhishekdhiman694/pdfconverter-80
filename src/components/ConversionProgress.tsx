
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Hourglass, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConversionStatus = 'processing' | 'success' | 'error';

interface ConversionProgressProps {
  status: ConversionStatus;
  progress: number;
  fileName: string;
  errorMessage?: string;
  className?: string;
}

const ConversionProgress = ({ 
  status, 
  progress, 
  fileName, 
  errorMessage,
  className 
}: ConversionProgressProps) => {
  return (
    <div className={cn("bg-white p-4 rounded-xl border", className, {
      'border-zinc-100': status === 'processing',
      'border-green-100': status === 'success',
      'border-red-100': status === 'error'
    })}>
      <div className="flex items-center mb-3">
        {status === 'processing' && (
          <div className="w-8 h-8 rounded-full bg-zenith-100 flex items-center justify-center mr-3">
            <Hourglass className="w-4 h-4 text-zenith-500 animate-pulse" />
          </div>
        )}
        {status === 'success' && (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        )}
        {status === 'error' && (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-zinc-500">
            {status === 'processing' && 'Converting...'}
            {status === 'success' && 'Conversion complete'}
            {status === 'error' && (errorMessage || 'Conversion failed')}
          </p>
        </div>
        
        <span className="text-sm font-medium ml-2">
          {progress}%
        </span>
      </div>
      
      <Progress 
        value={progress} 
        className={cn("h-1.5", {
          'bg-zenith-100': status === 'processing',
          'bg-green-100': status === 'success',
          'bg-red-100': status === 'error'
        })}
      />
    </div>
  );
};

export default ConversionProgress;
