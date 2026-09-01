"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateAdminCredentials } from "@/lib/auth";
import { signAdminToken } from "@/lib/jwt";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAdminCredentials(username, password)) {
  // Generate JWT token and store it
  if (typeof window !== "undefined") {
    const token = signAdminToken();
    sessionStorage.setItem("adminToken", token);
  }
  // Redirect to admin dashboard
  router.push("/admin");
      // Store admin flag in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("isAdmin", "true");
      }
      // Redirect to admin dashboard
      router.push("/admin");
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login Admin</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
