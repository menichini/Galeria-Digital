import React, { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Exibe a foto capturada com a moldura selecionada.
 * Para simplificar, usamos duas imagens sobrepostas com CSS.
 * Em produção poderíamos usar canvas para mesclar as imagens.
 */
export const Preview: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
  const [photo, setPhoto] = useState<string>('');
  const [frame, setFrame] = useState<string>('');

  useEffect(() => {
    const captured = sessionStorage.getItem('capturedImage') || '';
    const chosen = sessionStorage.getItem('selectedFrame') || '';
    setPhoto(captured);
    setFrame(chosen);
  }, []);

  if (!photo) {
    return <p>Imagem não encontrada. Volte à captura.</p>;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 300,
        height: 400,
        margin: '2rem auto',
        backgroundImage: frame ? `url(${frame})` : undefined,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Foto original */}
      <img
        src={photo}
        alt="Foto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 2,
        }}
      />
      <div style={{ position: 'absolute', bottom: '-3rem', left: 0, right: 0, textAlign: 'center' }}>
        <button
          onClick={onConfirm}
          style={{
            background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
            color: '#fff',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Confirmar e Enviar
        </button>
      </div>
    </div>
  );
};

export default Preview;
