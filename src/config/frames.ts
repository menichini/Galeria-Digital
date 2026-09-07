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
  'martin-1': {
    id: 'martin-1',
    image: '/frames/frame_martin.jpg',
    cropArea: {
      // Calibragem para frame_martin.jpg:
      // Inicia em 22% do topo (abaixo da placa "Fazendinha do Martin")
      // Inicia em 10% da esquerda e possui 80% de largura (deixando 10% na direita)
      // A altura é 58%, o que faz ir do 22% até 80%, sobrando 20% no fundo para o menino e os animais.
      x: 0.10,
      y: 0.22,
      width: 0.80,
      height: 0.58,
    },
  },
};
