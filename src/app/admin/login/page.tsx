"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Redireciona para o painel de admin
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-background)', fontFamily: 'var(--font-primary)' }}>
      <h1 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', marginBottom: '2rem' }}>Acesso Restrito</h1>
      
      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '320px', padding: '2rem' }}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Autenticando...' : 'Entrar no Painel'}
        </button>
      </form>
    </div>
  );
}
