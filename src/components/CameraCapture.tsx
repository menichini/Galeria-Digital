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
 * or upload an existing image from the file system. Two distinct buttons are
 * presented: "Abrir Câmera" and "Selecionar Foto".
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
    <div className="camera-capture glass-card animate-in">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleCameraClick}
        className="btn btn-primary"
      >
        📸 Abrir Câmera
      </button>

      <button
        type="button"
        onClick={handleUploadClick}
        className="btn btn-secondary"
      >
        🖼️ Selecionar Foto
      </button>
    </div>
  );
};
