import { GalleryView } from '@/components/views/GalleryView';

export const metadata = {
  title: 'Mural da Olga — Fazendinha da Olga',
  description: 'Confira as fotos da Fazendinha da Olga!',
};

export default function OlgaGalleryPage() {
  return <GalleryView eventId="olga" />;
}
