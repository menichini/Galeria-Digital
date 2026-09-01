import React from 'react';
import Image from 'next/image';

// Static list of frame image filenames placed in public/frames.
// Add new filenames here when you add new frames.
const frameFiles = [
  // Arquivos de moldura presentes em public/frames
  'frame1.png',
  'frame_martin.jpg',
];

/**
 * Component to display available frame images for selection.
 * Expects frame PNGs to be placed in `public/frames/`.
 */
const FrameSelector: React.FC<{ onSelect: (frame: string) => void }> = ({ onSelect }) => {
  // Use the static `frameFiles` array defined above.
  // Frame paths will be resolved relative to the /public folder.
  // No server-side file system access needed in client component.

  return (
    <div className="frame-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
      {frameFiles.map((file) => (
        <button
          key={file}
          onClick={() => onSelect(`/frames/${file}`)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <Image src={`/frames/${file}`} alt={file} width={120} height={120} />
        </button>
      ))}
    </div>
  );
};

export default FrameSelector;
