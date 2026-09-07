import React, { useState } from 'react';
import Image from 'next/image';
import { FRAMES } from '../config/frames';

const FrameSelector: React.FC<{ onSelect: (frameId: string) => void }> = ({ onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2 mb-10">
        {Object.values(FRAMES).map((frame) => {
          const isSelected = selected === frame.id;
          return (
            <button
              key={frame.id}
              onClick={() => setSelected(frame.id)}
              className={`
                relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50
                ${isSelected 
                  ? 'ring-4 ring-brand-primary shadow-[0_8px_24px_rgba(85,139,47,0.4)] scale-105 z-10' 
                  : 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] opacity-90 hover:opacity-100'}
              `}
            >
              <Image 
                src={frame.image} 
                alt={frame.id} 
                fill
                className="object-contain p-2 drop-shadow-sm"
                sizes="(max-width: 768px) 50vw, 33vw"
                priority
              />
              
              {/* Selected overlay indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg-main via-bg-main to-transparent z-20 flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full max-w-[400px] py-4 text-xl font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          Continuar ➔
        </button>
      </div>
    </div>
  );
};

export default FrameSelector;
