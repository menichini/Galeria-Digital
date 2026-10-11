"use client";
import './admin.css';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FileItem {
  id: string;
  name: string;
  url: string;
  isApproved: boolean;
  createdAt: string;
  eventId?: 'martin' | 'olga';
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState<'all' | 'martin' | 'olga'>('all');
  const router = useRouter();

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/admin/list');
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error('Failed to fetch files', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      
      // Optimistic update
      setFiles(prev => prev.map(f => f.id === id ? { ...f, isApproved: newStatus } : f));
      
      const res = await fetch(`/api/admin/toggle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: newStatus })
      });
      
      if (!res.ok) {
        fetchFiles();
        alert('Erro ao atualizar status da foto.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta foto permanentemente?")) return;
    
    try {
      const res = await fetch(`/api/admin/delete?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.id !== id));
      } else {
        alert('Erro ao remover foto.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-background)' }}>
      <h2>Carregando Painel...</h2>
    </div>
  );

  const martinCount = files.filter(f => (f.eventId || 'martin') === 'martin').length;
  const olgaCount = files.filter(f => f.eventId === 'olga').length;

  const displayedFiles = files.filter(f => {
    if (filterEvent === 'all') return true;
    return (f.eventId || 'martin') === filterEvent;
  });

  const totalPhotos = displayedFiles.length;
  const approvedPhotos = displayedFiles.filter(f => f.isApproved).length;
  const rejectedPhotos = totalPhotos - approvedPhotos;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-top">
          <h1>Painel de Moderação</h1>
          <button 
            className="btn btn-primary qr-btn"
            onClick={() => router.push('/admin/qr')}
          >
            🖨️ Gerar QR Codes
          </button>
        </div>

        {/* Event Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterEvent('all')}
            className={`btn ${filterEvent === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 16px', fontSize: '14px', borderRadius: '9999px' }}
          >
            🌟 Todos ({files.length})
          </button>
          <button
            onClick={() => setFilterEvent('martin')}
            className={`btn ${filterEvent === 'martin' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ 
              padding: '6px 16px', 
              fontSize: '14px', 
              borderRadius: '9999px',
              backgroundColor: filterEvent === 'martin' ? '#558B2F' : 'transparent',
              color: filterEvent === 'martin' ? '#fff' : '#558B2F',
              borderColor: '#558B2F'
            }}
          >
            🐮 Martin ({martinCount})
          </button>
          <button
            onClick={() => setFilterEvent('olga')}
            className={`btn ${filterEvent === 'olga' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ 
              padding: '6px 16px', 
              fontSize: '14px', 
              borderRadius: '9999px',
              backgroundColor: filterEvent === 'olga' ? '#D81B60' : 'transparent',
              color: filterEvent === 'olga' ? '#fff' : '#D81B60',
              borderColor: '#D81B60'
            }}
          >
            🌸 Olga ({olgaCount})
          </button>
        </div>
        
        <div className="stats-bar">
          <div className="stat-box">
            <span className="stat-value">{totalPhotos}</span>
            <span className="stat-label">Total Mostrado</span>
          </div>
          <div className="stat-box stat-approved">
            <span className="stat-value">{approvedPhotos}</span>
            <span className="stat-label">Aprovadas</span>
          </div>
          <div className="stat-box stat-rejected">
            <span className="stat-value">{rejectedPhotos}</span>
            <span className="stat-label">Ocultas</span>
          </div>
        </div>
      </header>

      {displayedFiles.length === 0 ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Nenhuma foto encontrada para este filtro.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {displayedFiles.map((file) => {
            const isOlga = file.eventId === 'olga';
            return (
              <div key={file.id} className={`admin-card ${!file.isApproved ? 'rejected' : ''}`}>
                <div className="photo-wrapper" style={{ position: 'relative' }}>
                  <Image src={file.url} alt={file.name} fill className="photo" />
                  
                  {/* Badge de Evento */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: isOlga ? 'rgba(216, 27, 96, 0.9)' : 'rgba(85, 139, 47, 0.9)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      zIndex: 2,
                    }}
                  >
                    {isOlga ? '🌸 Olga' : '🐮 Martin'}
                  </span>

                  {!file.isApproved && (
                    <div className="rejected-overlay">
                      <span>OCULTA</span>
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  <p className="filename">
                    {new Date(file.createdAt).toLocaleTimeString('pt-BR')} - {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <button 
                    className={`btn ${file.isApproved ? 'btn-danger' : 'btn-success'}`} 
                    onClick={() => handleToggle(file.id, file.isApproved)}
                  >
                    {file.isApproved ? '🚫 Ocultar' : '✅ Aprovar'}
                  </button>
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => handleDelete(file.id)}
                    style={{ color: '#dc3545', borderColor: '#dc3545' }}
                  >
                    🗑️ Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
