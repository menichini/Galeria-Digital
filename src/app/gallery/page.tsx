"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import './gallery.css';

interface FileItem {
  name: string;
  url: string;
  createdAt?: string;
}

export default function GalleryPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/public/list');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error('Failed to fetch public gallery files', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) return <div className="glass-card" style={{ margin: '3rem auto', maxWidth: 400, textAlign: 'center' }}><h2>Carregando mural...</h2></div>;

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Mural do Martin</h1>
      {files.length === 0 ? (
        <div className="glass-card" style={{ margin: '3rem auto', maxWidth: 400, textAlign: 'center' }}>
          <p>Nenhuma foto foi tirada ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="grid">
          {files.map((file) => (
            <div key={file.name} className="card">
              <div className="photo-wrapper">
                <Image src={file.url} alt="Foto da festa" fill className="photo" sizes="(max-width: 768px) 100vw, 300px" />
              </div>
              <div className="photo-date">
                {file.createdAt ? new Date(file.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
