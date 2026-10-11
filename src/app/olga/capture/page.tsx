import { CaptureView } from '@/components/views/CaptureView';

export const metadata = {
  title: 'Tirar Foto — Fazendinha da Olga',
  description: 'Tire sua foto com a moldura da Fazendinha da Olga!',
};

export default function OlgaCapturePage() {
  return <CaptureView eventId="olga" />;
}
