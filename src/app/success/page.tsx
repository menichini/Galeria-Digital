import { SuccessView } from '@/components/views/SuccessView';

export const metadata = {
  title: 'Foto Salva! — Fazendinha do Martin',
  description: 'Sua foto foi salva no mural da Fazendinha do Martin!',
};

export default function SuccessPage() {
  return <SuccessView eventId="martin" />;
}
