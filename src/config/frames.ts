export type FrameConfig = {
  id: string;
  image: string;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const FRAMES: Record<string, FrameConfig> = {
  'martin-final': {
    id: 'martin-final',
    image: '/frames/moldura_martin_final.png',
    cropArea: {
      // Ajuste para a nova moldura em formato PNG com buraco vazado
      // Como a arte tem proporção parecida, mantemos valores muito próximos.
      x: 0.10,
      y: 0.22,
      width: 0.80,
      height: 0.58,
    },
  },
};
