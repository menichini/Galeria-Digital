"use client";
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

export default function QRCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [productionUrl, setProductionUrl] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = sessionStorage.getItem("isAdmin");
      // O token via cookie verifica na API, mas podemos ter um check client-side básico também
      if (!isAdmin) {
        // Redireciona, porém não se preocupe tanto com segurança extrema aqui pois não expõe dados do banco
        // router.replace("/admin/login");
      }
      
      // Construir a URL base automaticamente
      // No Vercel, isso será o domínio de produção. Localmente será localhost.
      setProductionUrl(window.location.origin);
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#f4f4f4', fontFamily: 'var(--font-primary), sans-serif' }}>
      <button 
        onClick={() => router.push('/admin')}
        style={{ padding: '0.5rem 1rem', marginBottom: '2rem', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        ← Voltar ao Painel
      </button>

      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', marginBottom: '1rem', fontSize: '2rem' }}>Acesso à Galeria</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          Escaneie o QR Code abaixo para tirar e enviar suas fotos para o mural da Fazendinha!
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <div style={{ padding: '1rem', border: '4px solid var(--color-primary)', borderRadius: '16px', background: 'white' }}>
            <QRCodeSVG 
              value={`${productionUrl}/capture`}
              size={300}
              bgColor={"#ffffff"}
              fgColor={"#333333"}
              level={"Q"}
              includeMargin={false}
            />
          </div>
        </div>
        
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
          {productionUrl}/capture
        </p>

        <button 
          onClick={() => window.print()} 
          style={{ marginTop: '2rem', padding: '1rem 2rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 600 }}
          className="print-hidden"
        >
          🖨️ Imprimir
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
