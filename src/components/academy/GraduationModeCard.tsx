import React from 'react';

interface GraduationModeCardProps {
  mode: string;
  title: string;
  description: string;
  features: string[];
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const GraduationModeCard: React.FC<GraduationModeCardProps> = ({
  mode,
  title,
  description,
  features,
  selected = false,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`border ${selected ? 'border-white bg-white text-black' : 'border-white/50'} p-6 cursor-pointer transition-all hover:border-white ${className}`}
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-2 uppercase tracking-wider">{title}</h3>
      <p className="text-sm mb-4 opacity-80">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-xs uppercase tracking-wider">• {feature}</li>
        ))}
      </ul>
    </div>
  );
};