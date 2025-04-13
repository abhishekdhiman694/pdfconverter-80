
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  className?: string;
}

const ToolCard = ({ title, description, icon: Icon, path, className }: ToolCardProps) => {
  return (
    <Link to={path} className={cn("tool-card p-6 flex flex-col items-center", className)}>
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zenith-400/20 to-zenith-500/20 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-zenith-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <p className="text-zinc-500 text-center text-sm">{description}</p>
    </Link>
  );
};

export default ToolCard;
