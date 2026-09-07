export type FrameConfig = {
  id: string;
  image: string;
  defaultFrame?: boolean;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const DEFAULT_EVENT_FRAME: FrameConfig = {
  id: 'martin-final',
  image: '/frames/moldura_martin_final.png',
  defaultFrame: true,
  cropArea: {
    // Ajuste para a nova moldura em formato PNG com buraco vazado
    // Como a arte tem proporção parecida, mantemos valores muito próximos.
    x: 0.10,
    y: 0.22,
    width: 0.80,
    height: 0.58,
  },
};

// Mantido apenas por compatibilidade com códigos antigos, mas aponta para o único frame.
export const FRAMES: Record<string, FrameConfig> = {
  [DEFAULT_EVENT_FRAME.id]: DEFAULT_EVENT_FRAME,
};
