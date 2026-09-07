import React from 'react';
import Image from 'next/image';
import { FRAMES } from '../config/frames';

const FrameSelector: React.FC<{ onSelect: (frameId: string) => void }> = ({ onSelect }) => {
  return (
    <div className="frame-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', padding: '1rem' }}>
      {Object.values(FRAMES).map((frame) => (
        <button
          key={frame.id}
          onClick={() => onSelect(frame.id)}
          style={{ 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer',
            transition: 'transform 0.2s',
            padding: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            backgroundColor: '#fff',
            display: 'flex'
          }}>
            <Image 
              src={frame.image} 
              alt={frame.id} 
              width={240} 
              height={320}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </button>
      ))}
    </div>
  );
};

export default FrameSelector;
