import { SuccessView } from '@/components/views/SuccessView';

export const metadata = {
  title: 'Foto Salva! — Fazendinha da Olga',
  description: 'Sua foto foi salva no mural da Fazendinha da Olga!',
};

export default function OlgaSuccessPage() {
  return <SuccessView eventId="olga" />;
}
