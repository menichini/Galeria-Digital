import { CaptureView } from '@/components/views/CaptureView';

export const metadata = {
  title: 'Tirar Foto — Fazendinha do Martin',
  description: 'Tire sua foto com a moldura da Fazendinha do Martin!',
};

export default function CapturePage() {
  return <CaptureView eventId="martin" />;
}
