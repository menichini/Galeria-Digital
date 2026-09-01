'use client';
import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  /**
   * Callback invoked when a file (photo) is selected or captured.
   */
  onCapture: (file: File) => void;
}

/**
 * Component allowing the user to either capture a photo via the device camera
 * or upload an existing image from the file system. Two distinct buttons are
 * presented: "Abrir Câmera" and "Selecionar Foto".
 */
export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Open the native file picker for uploading a photo
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Open the camera modal (if MediaDevices supported)
  const handleCameraClick = () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setShowCamera(true);
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error('Erro ao acessar a câmera:', err);
          // Fallback to file upload if camera fails
          fileInputRef.current?.click();
        });
    } else {
      // No MediaDevices support – fallback to upload
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.png', { type: 'image/png' });
        onCapture(file);
      }
    }, 'image/png');
    // Stop the stream and close modal
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div className="camera-capture glass-card animate-in">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', overflow: 'hidden', zIndex: -1 }}
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

      {/* Camera modal */}
      {showCamera && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100dvh',
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          className="animate-in"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ 
              maxWidth: '90%', 
              maxHeight: '70vh', 
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              marginBottom: '1rem' 
            }}
          />
          <div style={{ width: '90%', maxWidth: '400px' }}>
            <button
              onClick={handleCaptureFromCamera}
              className="btn btn-primary"
            >
              Capturar Foto
            </button>
            <button
              onClick={handleCloseCamera}
              className="btn btn-ghost"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
