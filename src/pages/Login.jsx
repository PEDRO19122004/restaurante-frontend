import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch(
          "https://restaurante-bot-production-b7f0.up.railway.app/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, senha: senha }),
          }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Credenciais inválidas");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("nivel", data.nivel);
      onLogin(data.token, data.nivel);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background-color: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Grade sutil */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Brilho laranja central */
        .login-root::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 10;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(249,115,22,0.15);
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          backdrop-filter: blur(12px);
          box-shadow:
            0 0 0 1px rgba(249,115,22,0.05),
            0 24px 64px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .login-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 16px rgba(249,115,22,0.35);
        }

        .login-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .login-logo-text span {
          color: #f97316;
        }

        .login-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 32px;
          padding-left: 48px;
        }

        .login-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .login-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 28px;
        }

        .login-divider {
          height: 1px;
          background: rgba(249,115,22,0.1);
          margin-bottom: 28px;
        }

        .login-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .login-field {
          margin-bottom: 18px;
        }

        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #ffffff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .login-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .login-input:focus {
          border-color: rgba(249,115,22,0.5);
          background: rgba(249,115,22,0.04);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.08);
        }

        .login-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #fca5a5;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(249,115,22,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          box-shadow: 0 6px 28px rgba(249,115,22,0.45);
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Badge JWT */
        .login-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          padding: 9px 14px;
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 8px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse-dot 1.8s ease-in-out infinite;
          flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
        }

        @keyframes pulse-dot {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        .badge-text {
          font-size: 12px;
          color: rgba(34,197,94,0.8);
          font-weight: 500;
        }
      `}</style>

        <div className="login-root">
          <div className="login-card">
            <div className="login-logo">
              <div className="login-logo-icon">🍽️</div>
              <span className="login-logo-text">Restaurante<span>Bot</span></span>
            </div>
            <p className="login-subtitle">Painel de Gerenciamento</p>

            <div className="login-divider" />

            <h1 className="login-title">Entrar no sistema</h1>
            <p className="login-desc">Acesse com suas credenciais de usuário</p>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label" htmlFor="email">E-mail</label>
                <input
                    id="email"
                    className="login-input"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    className="login-input"
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    autoComplete="current-password"
                />
              </div>

              {erro && (
                  <div className="login-error">
                    <span>⚠️</span>
                    {erro}
                  </div>
              )}

              <button className="login-btn" type="submit" disabled={carregando}>
                {carregando ? (
                    <>
                      <div className="spinner" />
                      Autenticando...
                    </>
                ) : (
                    "Entrar"
                )}
              </button>
            </form>

            <div className="login-badge">
              <div className="badge-dot" />
              <span className="badge-text">Sistema seguro com JWT · Sessão de 24h</span>
            </div>
          </div>
        </div>
      </>
  );
}