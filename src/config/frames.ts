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
    x: 0.10,
    y: 0.22,
    width: 0.80,
    height: 0.58,
  },
};

export const OLGA_EVENT_FRAME: FrameConfig = {
  id: 'olga-final',
  image: '/frames/Moldura-Cha-de-Bebe-da-Olga.png',
  defaultFrame: true,
  cropArea: {
    x: 0.16,
    y: 0.18,
    width: 0.71,
    height: 0.52,
  },
};

export const FRAMES: Record<string, FrameConfig> = {
  [DEFAULT_EVENT_FRAME.id]: DEFAULT_EVENT_FRAME,
  [OLGA_EVENT_FRAME.id]: OLGA_EVENT_FRAME,
};
