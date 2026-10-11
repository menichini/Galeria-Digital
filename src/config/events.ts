import { DEFAULT_EVENT_FRAME, OLGA_EVENT_FRAME, FrameConfig } from './frames';

export type EventId = 'martin' | 'olga';

export interface EventConfig {
  id: EventId;
  name: string;
  title: string;
  subtitle: string;
  landingUrl: string;
  captureUrl: string;
  galleryUrl: string;
  previewUrl: string;
  successUrl: string;
  landingImage: string;
  landingBg: string;
  frame: FrameConfig;
  downloadPrefix: string;
  shareTitle: string;
  shareText: string;
  emojis: string;
  themeClass: string;
}

export const EVENTS: Record<EventId, EventConfig> = {
  martin: {
    id: 'martin',
    name: 'Fazendinha do Martin',
    title: 'Mural do Martin',
    subtitle: 'As memórias mais divertidas da nossa fazendinha!',
    landingUrl: '/',
    captureUrl: '/capture',
    galleryUrl: '/gallery',
    previewUrl: '/preview',
    successUrl: '/success',
    landingImage: '/fotosite.png',
    landingBg: 'bg-bg-main',
    frame: DEFAULT_EVENT_FRAME,
    downloadPrefix: 'fazendinha-martin-2-anos',
    shareTitle: 'Fazendinha do Martin — 2 anos',
    shareText: 'Olha essa lembrança da Fazendinha do Martin! 🎉',
    emojis: '🐴 🌻 🐄',
    themeClass: '',
  },
  olga: {
    id: 'olga',
    name: 'Fazendinha da Olga',
    title: 'Mural da Olga',
    subtitle: 'As memórias mais doces e divertidas da nossa fazendinha!',
    landingUrl: '/olga',
    captureUrl: '/olga/capture',
    galleryUrl: '/olga/gallery',
    previewUrl: '/olga/preview',
    successUrl: '/olga/success',
    landingImage: '/chadebebedaolga.jpeg',
    landingBg: '#FDEAF0',
    frame: OLGA_EVENT_FRAME,
    downloadPrefix: 'fazendinha-olga',
    shareTitle: 'Fazendinha da Olga — Chá de Bebê',
    shareText: 'Olha essa lembrança da Fazendinha da Olga! 🌸',
    emojis: '🎀 🌸 🐮 🐷',
    themeClass: 'theme-olga',
  },
};

export function getEventConfig(eventId?: string | null): EventConfig {
  if (eventId === 'olga') {
    return EVENTS.olga;
  }
  return EVENTS.martin;
}
