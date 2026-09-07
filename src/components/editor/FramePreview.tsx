import React, { useRef, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import { TransformState, CropArea } from '../../hooks/usePhotoTransform';

export interface FramePreviewProps {
  photoSrc: string;
  frameSrc: string;
  transform: TransformState;
  onTransformChange: (t: TransformState) => void;
  cropArea: CropArea;
  frameAspectRatio: number;
  onPhotoLoad: (width: number, height: number) => void;
  onContainerResize: (width: number, height: number) => void;
}

export const FramePreview: React.FC<FramePreviewProps> = ({
  photoSrc,
  frameSrc,
  transform,
  onTransformChange,
  cropArea,
  frameAspectRatio,
  onPhotoLoad,
  onContainerResize
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        onContainerResize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onContainerResize]);

  const [{ x, y, scale, rotate }, api] = useSpring(() => ({
    x: transform.x,
    y: transform.y,
    scale: transform.scale,
    rotate: transform.rotation,
    config: { tension: 300, friction: 30 }
  }));

  useEffect(() => {
    api.start({
      x: transform.x,
      y: transform.y,
      scale: transform.scale,
      rotate: transform.rotation
    });
  }, [transform, api]);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        onTransformChange({ ...transform, x: dx, y: dy });
      },
      onPinch: ({ offset: [d] }) => {
        onTransformChange({ ...transform, scale: d });
      }
    },
    {
      target: containerRef,
      drag: { from: () => [transform.x, transform.y] },
      pinch: { scaleBounds: { min: 0.1, max: 10 }, modifierKey: 'ctrlKey' },
      eventOptions: { passive: false }
    }
  );

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: frameAspectRatio, 
        backgroundColor: '#e0e0e0',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        touchAction: 'none'
      }}
    >
      {/* Mask area matching safe area */}
      <div style={{
        position: 'absolute',
        top: `${cropArea.y * 100}%`,
        left: `${cropArea.x * 100}%`,
        width: `${cropArea.width * 100}%`,
        height: `${cropArea.height * 100}%`,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <animated.img
          src={photoSrc}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            onPhotoLoad(img.naturalWidth, img.naturalHeight);
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`, 
            x,
            y,
            scale,
            rotateZ: rotate,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
        />
      </div>

      <img
        src={frameSrc}
        alt="Frame overlay"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 2,
          pointerEvents: 'none',
          mixBlendMode: (frameSrc.endsWith('.jpg') || frameSrc.endsWith('.jpeg')) ? 'multiply' : 'normal'
        }}
      />
    </div>
  );
};
