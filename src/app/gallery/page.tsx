import { GalleryView } from '@/components/views/GalleryView';

export const metadata = {
  title: 'Mural do Martin — Fazendinha do Martin',
  description: 'As memórias mais divertidas da nossa fazendinha!',
};

export default function GalleryPage() {
  return <GalleryView eventId="martin" />;
}
