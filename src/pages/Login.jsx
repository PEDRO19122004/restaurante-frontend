import { useState } from "react";

const API = "https://restaurante-bot-production-b7f0.up.railway.app";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Erro ao fazer login");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("nivel", data.nivel);
      localStorage.setItem("nome", data.nome);
      onLogin(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-wrapper {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Grade de fundo */
        .login-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Brilho de fundo */
        .login-wrapper::after {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: #0f0f1a;
          border: 1px solid #1e1e2e;
          border-radius: 24px;
          padding: 44px 40px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .login-logo-dot {
          width: 10px;
          height: 10px;
          background: #f97316;
          border-radius: 50%;
          box-shadow: 0 0 16px #f97316;
        }

        .login-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .login-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 14px;
          color: #4a4a6a;
          margin-bottom: 36px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #6a6a8a;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          background: #0a0a0f;
          border: 1px solid #2a2a3a;
          border-radius: 12px;
          padding: 13px 16px;
          color: #e0e0f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .field-input::placeholder { color: #3a3a5a; }

        .field-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
        }

        .error-box {
          background: #1a0f0f;
          border: 1px solid #3a1a1a;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ef4444;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-login {
          width: 100%;
          background: #f97316;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }

        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
        }

        .btn-login:hover:not(:disabled) {
          background: #ea6a0a;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(249,115,22,0.3);
        }

        .btn-login:active:not(:disabled) { transform: translateY(0); }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #1e1e2e;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px #22c55e;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .footer-text {
          font-size: 12px;
          color: #3a3a5a;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">

          <div className="login-logo">
            <span className="login-logo-dot" />
            <span className="login-logo-text">RestBot</span>
          </div>

          <div className="login-title">Bem-vindo</div>
          <div className="login-subtitle">Acesse o painel administrativo</div>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <div>
                <div className="field-label">E-mail</div>
                <input
                  className="field-input"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="field-label">Senha</div>
                <input
                  className="field-input"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>

            {erro && (
              <div className="error-box">
                <span>⚠</span>
                {erro}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>

          <div className="login-footer">
            <span className="footer-dot" />
            <span className="footer-text">Sistema seguro com autenticação JWT</span>
          </div>

        </div>
      </div>
    </>
  );
}
