"use client";
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

export default function QRCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [productionUrl, setProductionUrl] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<'martin' | 'olga'>('olga');
  const [targetType, setTargetType] = useState<'landing' | 'capture'>('landing');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProductionUrl(window.location.origin);
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  const getTargetUrl = () => {
    if (selectedEvent === 'olga') {
      return targetType === 'landing' ? `${productionUrl}/olga` : `${productionUrl}/olga/capture`;
    }
    return targetType === 'landing' ? `${productionUrl}` : `${productionUrl}/capture`;
  };

  const targetUrl = getTargetUrl();
  const isOlga = selectedEvent === 'olga';
  const themeColor = isOlga ? '#D81B60' : '#558B2F';
  const eventTitle = isOlga ? 'Fazendinha da Olga' : 'Fazendinha do Martin';
  const eventSubtitle = isOlga
    ? 'Escaneie o QR Code abaixo para acessar o Chá de Bebê da Olga!'
    : 'Escaneie o QR Code abaixo para acessar o aniversário do Martin!';

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#f4f4f4', fontFamily: 'var(--font-primary), sans-serif' }}>
      <button 
        onClick={() => router.push('/admin')}
        style={{ padding: '0.5rem 1rem', marginBottom: '2rem', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}
        className="print-hidden"
      >
        ← Voltar ao Painel
      </button>

      {/* Controles de Seleção (Ocultos na Impressão) */}
      <div className="print-hidden" style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', background: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#333' }}>Configurar QR Code para Impressão</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>
              Selecione o Evento:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedEvent('olga')}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isOlga ? '2px solid #D81B60' : '1px solid #ccc',
                  background: isOlga ? '#FDEAF0' : '#fff',
                  color: isOlga ? '#D81B60' : '#666',
                }}
              >
                🌸 Fazendinha da Olga
              </button>
              <button
                type="button"
                onClick={() => setSelectedEvent('martin')}
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: !isOlga ? '2px solid #558B2F' : '1px solid #ccc',
                  background: !isOlga ? '#F1F8E9' : '#fff',
                  color: !isOlga ? '#558B2F' : '#666',
                }}
              >
                🐮 Fazendinha do Martin
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>
              Destino do QR Code:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setTargetType('landing')}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: targetType === 'landing' ? `2px solid ${themeColor}` : '1px solid #ccc',
                  background: targetType === 'landing' ? '#f0f0f0' : '#fff',
                  fontWeight: targetType === 'landing' ? 600 : 400,
                }}
              >
                🏠 Página Inicial (Arte + Botões)
              </button>
              <button
                type="button"
                onClick={() => setTargetType('capture')}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: targetType === 'capture' ? `2px solid ${themeColor}` : '1px solid #ccc',
                  background: targetType === 'capture' ? '#f0f0f0' : '#fff',
                  fontWeight: targetType === 'capture' ? 600 : 400,
                }}
              >
                📸 Câmera Direta (Tirar Foto)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cartão do QR Code para Exibição e Impressão */}
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: themeColor, fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', fontSize: '2.2rem' }}>
          {eventTitle}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.15rem' }}>
          {eventSubtitle}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <div style={{ padding: '1.25rem', border: `4px solid ${themeColor}`, borderRadius: '20px', background: 'white' }}>
            <QRCodeSVG 
              value={targetUrl}
              size={300}
              bgColor={"#ffffff"}
              fgColor={"#222222"}
              level={"Q"}
              includeMargin={false}
            />
          </div>
        </div>
        
        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 600, color: '#333', wordBreak: 'break-all' }}>
          {targetUrl}
        </p>

        <button 
          onClick={() => window.print()} 
          style={{ marginTop: '2rem', padding: '1rem 2rem', background: themeColor, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 600 }}
          className="print-hidden"
        >
          🖨️ Imprimir Cartaz
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .glass-card, .glass-card * {
            visibility: visible;
          }
          .glass-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
