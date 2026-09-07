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
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
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
        // Revert on failure
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

  const totalPhotos = files.length;
  const approvedPhotos = files.filter(f => f.isApproved).length;
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
            🖨️ Gerar QR Code
          </button>
        </div>
        
        <div className="stats-bar">
          <div className="stat-box">
            <span className="stat-value">{totalPhotos}</span>
            <span className="stat-label">Total de Fotos</span>
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

      {files.length === 0 ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Nenhuma foto foi enviada ainda.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {files.map((file) => (
            <div key={file.id} className={`admin-card ${!file.isApproved ? 'rejected' : ''}`}>
              <div className="photo-wrapper">
                <Image src={file.url} alt={file.name} fill className="photo" />
                {!file.isApproved && (
                  <div className="rejected-overlay">
                    <span>OCULTA</span>
                  </div>
                )}
              </div>
              <div className="card-actions">
                <p className="filename">{new Date(file.createdAt).toLocaleTimeString('pt-BR')} - {new Date(file.createdAt).toLocaleDateString('pt-BR')}</p>
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
          ))}
        </div>
      )}
    </div>
  );
}
