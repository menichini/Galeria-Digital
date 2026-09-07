import { useState, useCallback } from 'react';

export interface TransformState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function usePhotoTransform(
  photoWidth: number,
  photoHeight: number,
  containerWidth: number,
  containerHeight: number,
  cropArea: CropArea
) {
  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 1, rotation: 0 });

  const safeWidth = containerWidth * cropArea.width;
  const safeHeight = containerHeight * cropArea.height;

  const absRot = Math.abs(transform.rotation) % 360;
  const isRotated90 = (absRot > 45 && absRot <= 135) || (absRot > 225 && absRot <= 315);
  
  const effectivePhotoWidth = isRotated90 ? photoHeight : photoWidth;
  const effectivePhotoHeight = isRotated90 ? photoWidth : photoHeight;

  const minScaleToFill = Math.max(
    safeWidth / (effectivePhotoWidth || 1),
    safeHeight / (effectivePhotoHeight || 1)
  );

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const constrainPan = (x: number, y: number, scale: number) => {
    const currentW = (effectivePhotoWidth || 1) * scale;
    const currentH = (effectivePhotoHeight || 1) * scale;
    
    const maxX = Math.max(0, (currentW - safeWidth) / 2);
    const maxY = Math.max(0, (currentH - safeHeight) / 2);
    
    return {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY)
    };
  };

  const center = useCallback(() => {
    setTransform(prev => ({ ...prev, x: 0, y: 0 }));
  }, []);

  const fill = useCallback(() => {
    setTransform(prev => ({ ...prev, x: 0, y: 0, scale: minScaleToFill }));
  }, [minScaleToFill]);

  const fit = useCallback(() => {
    const scaleToFit = Math.min(
      safeWidth / (effectivePhotoWidth || 1),
      safeHeight / (effectivePhotoHeight || 1)
    );
    setTransform(prev => ({ ...prev, x: 0, y: 0, scale: scaleToFit }));
  }, [safeWidth, safeHeight, effectivePhotoWidth, effectivePhotoHeight]);

  const setZoom = useCallback((newScale: number) => {
    const safeScale = Math.max(minScaleToFill, newScale);
    setTransform(prev => {
      const constrained = constrainPan(prev.x, prev.y, safeScale);
      return { ...prev, scale: safeScale, x: constrained.x, y: constrained.y };
    });
  }, [minScaleToFill, effectivePhotoWidth, effectivePhotoHeight, safeWidth, safeHeight]);

  const setPan = useCallback((x: number, y: number) => {
    setTransform(prev => {
      const constrained = constrainPan(x, y, prev.scale);
      return { ...prev, x: constrained.x, y: constrained.y };
    });
  }, [effectivePhotoWidth, effectivePhotoHeight, safeWidth, safeHeight]);

  const setRotation = useCallback((rotation: number) => {
    setTransform(prev => ({ ...prev, rotation }));
  }, []);

  return {
    transform,
    setTransform,
    center,
    fit,
    fill,
    setZoom,
    setPan,
    setRotation,
    minScaleToFill
  };
}
