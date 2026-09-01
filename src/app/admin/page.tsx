"use client";
import './admin.css';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FileItem {
  name: string;
  url: string;
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Guard: ensure admin flag is set
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = sessionStorage.getItem("isAdmin");
      if (!isAdmin) {
        router.replace("/admin/login");
      }
    }
  }, []);

  const fetchFiles = async () => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null;
      const res = await fetch('/api/admin/list', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
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

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Excluir "${fileName}"?`)) return;
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null;
      const res = await fetch(`/api/admin/delete?file=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        // Refresh list
        fetchFiles();
      } else {
        const err = await res.json();
        alert(`Erro ao excluir: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="admin-container">
      <h1>Administração de Fotos</h1>
      {files.length === 0 ? (
        <p>Nenhuma foto encontrada.</p>
      ) : (
        <div className="grid">
          {files.map((file) => (
            <div key={file.name} className="card">
              <Image src={file.url} alt={file.name} width={200} height={200} className="photo" />
              <p className="filename">{file.name}</p>
              <button className="delete-btn" onClick={() => handleDelete(file.name)}>
                🗑️ Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
