import React from 'react';
import Image from 'next/image';

interface QuickPreviewProps {
  composedImage: string;
  isUploading: boolean;
  onConfirm: () => void;
  onCustomize: () => void;
  onRetake: () => void;
}

export const QuickPreview: React.FC<QuickPreviewProps> = ({
  composedImage,
  isUploading,
  onConfirm,
  onCustomize,
  onRetake,
}) => {
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <div className="w-full max-w-[400px] rounded-2xl overflow-hidden shadow-lg border-[4px] border-white/20">
        <Image
          src={composedImage}
          alt="Preview da foto com moldura"
          width={800}
          height={800}
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="w-full max-w-[400px] flex flex-col gap-4 mt-2">
        <button
          onClick={onConfirm}
          disabled={isUploading}
          className="w-full py-4 text-xl font-display font-semibold text-white bg-brand-primary rounded-full shadow-[0_4px_14px_rgba(85,139,47,0.3)] transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          {isUploading ? 'Enviando...' : 'Finalizar e Enviar 🎉'}
        </button>

        <button
          onClick={onCustomize}
          disabled={isUploading}
          className="w-full py-3 text-lg font-medium text-brand-primary bg-white border-2 border-brand-primary/20 rounded-full transition-all duration-200 hover:bg-brand-primary/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quero personalizar
        </button>

        <button
          onClick={onRetake}
          disabled={isUploading}
          className="w-full py-2 text-sm font-medium text-text-muted hover:text-text-main underline decoration-text-muted/30 underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refazer foto
        </button>
      </div>
    </div>
  );
};
