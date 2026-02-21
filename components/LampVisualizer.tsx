import React from 'react';

interface LampVisualizerProps {
  lastAction: string;
  isLightOn: boolean;
  isSpeaking: boolean;
}

const LampVisualizer: React.FC<LampVisualizerProps> = ({ lastAction, isLightOn, isSpeaking }) => {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 ${
          isLightOn ? 'opacity-40 bg-yellow-400' : 'opacity-5 bg-blue-500'
        }`} 
      />
      
      {/* Lamp Base Representation */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Lamp Head */}
        <div 
          className={`w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
            isLightOn 
              ? 'bg-yellow-100 border-yellow-300 shadow-yellow-500/50' 
              : 'bg-slate-800 border-slate-600'
          } ${isSpeaking ? 'scale-105' : 'scale-100'}`}
        >
          {/* Eyes / Face */}
          <div className="flex gap-4">
             <div className={`w-3 h-8 rounded-full bg-slate-900 transition-all duration-200 ${isSpeaking ? 'h-6' : 'h-8'}`} />
             <div className={`w-3 h-8 rounded-full bg-slate-900 transition-all duration-200 ${isSpeaking ? 'h-6' : 'h-8'}`} />
          </div>
        </div>
        
        {/* Neck */}
        <div className="w-4 h-16 bg-slate-600 -mt-2"></div>
        
        {/* Base */}
        <div className="w-24 h-4 rounded-full bg-slate-700"></div>
        
        {/* Status Badge */}
        <div className="absolute -bottom-12 bg-slate-800/80 px-3 py-1 rounded-full text-xs text-blue-300 border border-slate-700 whitespace-nowrap">
          Current Action: <span className="text-white font-mono">{lastAction || 'idle'}</span>
        </div>
      </div>
    </div>
  );
};

export default LampVisualizer;
