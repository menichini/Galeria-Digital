'use client';
import React, { useRef } from 'react';

interface CameraCaptureProps {
  /**
   * Callback invoked when a file (photo) is selected or captured.
   */
  onCapture: (file: File) => void;
}

/**
 * Component allowing the user to either capture a photo via the device native camera
 * or upload an existing image from the file system.
 */
export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Open the native file picker for uploading a photo
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Open the native mobile camera app
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleCameraClick}
        className="w-full py-4 px-6 text-xl font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 flex items-center justify-center gap-3"
      >
        📸 Abrir Câmera
      </button>

      <button
        type="button"
        onClick={handleUploadClick}
        className="w-full py-4 px-6 text-lg font-display font-semibold text-text-muted bg-transparent border-2 border-text-muted rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-text-muted/50 flex items-center justify-center gap-3"
      >
        🖼️ Selecionar Foto
      </button>
    </div>
  );
};
