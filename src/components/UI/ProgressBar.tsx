import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'ocean' | 'coral' | 'green' | 'purple';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  progress, 
  className = '', 
  color = 'ocean', 
  showLabel = false, 
  label 
}: ProgressBarProps) {
  const colorClasses = {
    ocean: 'bg-ocean-600',
    coral: 'bg-coral-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };

  const backgroundClasses = {
    ocean: 'bg-ocean-100',
    coral: 'bg-coral-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full h-3 rounded-full ${backgroundClasses[color]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}