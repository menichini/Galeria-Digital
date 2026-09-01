"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import './gallery.css';

interface FileItem {
  name: string;
  url: string;
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

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="gallery-container">
      <h1>Galeria Pública</h1>
      {files.length === 0 ? (
        <p>Nenhuma foto encontrada.</p>
      ) : (
        <div className="grid">
          {files.map((file) => (
            <div key={file.name} className="card">
              <Image src={file.url} alt={file.name} width={200} height={200} className="photo" />
              <p className="filename">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
