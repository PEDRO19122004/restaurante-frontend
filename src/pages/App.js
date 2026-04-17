import { useState, useEffect } from "react";
import Login from "./pages/Login";

const API = "https://restaurante-bot-production-b7f0.up.railway.app";

function tokenValido(token) {
  return token && token !== "undefined" && token !== "null" && token.length > 10;
}

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconPedidos = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/>
  </svg>
);
const IconCardapio = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/>
    <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
);
const IconEstoque = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:#0a0a0f;color:#e8e8f0;min-height:100vh;}
    ::-webkit-scrollbar{width:6px;}
    ::-webkit-scrollbar-track{background:#0a0a0f;}
    ::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:3px;}
    .app-wrapper{min-height:100vh;background:#0a0a0f;display:flex;}
    .sidebar{position:fixed;left:0;top:0;bottom:0;width:240px;background:#0f0f1a;border-right:1px solid #1e1e2e;display:flex;flex-direction:column;z-index:100;}
    .sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid #1e1e2e;}
    .sidebar-logo-title{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#fff;letter-spacing:-0.5px;display:flex;align-items:center;gap:10px;}
    .logo-dot{width:8px;height:8px;background:#f97316;border-radius:50%;box-shadow:0 0 12px #f97316;}
    .sidebar-subtitle{font-size:11px;color:#4a4a6a;margin-top:4px;letter-spacing:0.5px;text-transform:uppercase;}
    .sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px;}
    .nav-label{font-size:10px;color:#3a3a5a;text-transform:uppercase;letter-spacing:1px;padding:8px 12px 4px;font-weight:600;}
    .nav-btn{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;border:none;background:transparent;color:#6a6a8a;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease;text-align:left;width:100%;}
    .nav-btn:hover{background:#1a1a2e;color:#c0c0e0;}
    .nav-btn.active{background:linear-gradient(135deg,#1a1a2e,#1e1e3a);color:#fff;border:1px solid #2a2a4a;box-shadow:0 2px 12px rgba(99,102,241,0.15);}
    .nav-btn.active svg{color:#f97316;}
    .sidebar-footer{padding:16px 12px;border-top:1px solid #1e1e2e;}
    .user-card{background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;}
    .user-info{flex:1;min-width:0;}
    .user-name{font-size:13px;font-weight:600;color:#e0e0f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .user-nivel{font-size:11px;color:#f97316;text-transform:capitalize;margin-top:1px;}
    .logout-btn{background:transparent;border:none;color:#4a4a6a;cursor:pointer;padding:6px;border-radius:8px;transition:all 0.15s;display:flex;align-items:center;}
    .logout-btn:hover{background:#2a1a1a;color:#ef4444;}
    .main-content{margin-left:240px;flex:1;padding:32px;min-height:100vh;}
    .page-header{margin-bottom:28px;}
    .page-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;}
    .page-subtitle{font-size:13px;color:#4a4a6a;margin-top:4px;}
    .page-header-row{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;}
    .cards-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
    .stat-card{background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;padding:22px;position:relative;overflow:hidden;transition:border-color 0.2s;}
    .stat-card:hover{border-color:#2a2a4a;}
    .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .stat-card.c-orange::before{background:linear-gradient(90deg,#f97316,transparent);}
    .stat-card.c-yellow::before{background:linear-gradient(90deg,#eab308,transparent);}
    .stat-card.c-green::before{background:linear-gradient(90deg,#22c55e,transparent);}
    .stat-card.c-red::before{background:linear-gradient(90deg,#ef4444,transparent);}
    .stat-label{font-size:11px;color:#4a4a6a;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:10px;}
    .stat-value{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}
    .stat-value.c-orange{color:#f97316;}.stat-value.c-yellow{color:#f0b429;}.stat-value.c-green{color:#22c55e;font-size:24px;}.stat-value.c-red{color:#ef4444;}
    .alert-box{background:#1a0f0f;border:1px solid #3a1a1a;border-radius:16px;padding:20px;margin-bottom:28px;}
    .alert-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#ef4444;display:flex;align-items:center;gap:8px;margin-bottom:14px;}
    .alert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
    .alert-item{background:#0f0f1a;border:1px solid #2a1a1a;border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;}
    .alert-item-name{font-size:13px;font-weight:500;color:#e0e0f0;}
    .alert-item-qty{font-size:12px;color:#ef4444;font-weight:600;}
    .panel-box{background:#0f0f1a;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;}
    .panel-box-header{padding:18px 22px;border-bottom:1px solid #1e1e2e;}
    .panel-box-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#e0e0f0;}
    .form-row{display:flex;gap:12px;flex-wrap:wrap;padding:18px 22px;}
    .input-field{flex:1;min-width:160px;background:#0a0a0f;border:1px solid #2a2a3a;border-radius:10px;padding:10px 14px;color:#e0e0f0;font-family:'DM Sans',sans-serif;font-size:13px;transition:border-color 0.15s;outline:none;}
    .input-field::placeholder{color:#3a3a5a;}
    .input-field:focus{border-color:#f97316;}
    .input-sm{width:130px;flex:none;}
    select.input-field{cursor:pointer;}
    .btn-primary{background:#f97316;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
    .btn-primary:hover{background:#ea6a0a;transform:translateY(-1px);}
    .data-table{width:100%;border-collapse:collapse;}
    .data-table th{text-align:left;padding:14px 22px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#4a4a6a;background:#0a0a0f;border-bottom:1px solid #1e1e2e;}
    .data-table td{padding:14px 22px;font-size:13px;color:#d0d0e8;border-bottom:1px solid #1e1e2e;}
    .data-table tr:last-child td{border-bottom:none;}
    .data-table tr:hover td{background:#141420;}
    .data-table tr.row-alert td{background:#1a0f0f;}
    .data-table tr.row-alert:hover td{background:#1e1010;}
    .empty-row td{text-align:center;color:#3a3a5a;padding:48px 22px;font-size:14px;}
    .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;text-transform:capitalize;}
    .badge::before{content:'';width:6px;height:6px;border-radius:50%;}
    .badge-recebido{background:#1a1500;color:#eab308;border:1px solid #2a2000;}
    .badge-recebido::before{background:#eab308;box-shadow:0 0 6px #eab308;}
    .badge-preparo{background:#001a2a;color:#38bdf8;border:1px solid #002a3a;}
    .badge-preparo::before{background:#38bdf8;box-shadow:0 0 6px #38bdf8;}
    .badge-pronto{background:#001a0f;color:#22c55e;border:1px solid #002a15;}
    .badge-pronto::before{background:#22c55e;box-shadow:0 0 6px #22c55e;animation:pulse 1.5s infinite;}
    .badge-entregue{background:#1a1a1a;color:#6a6a8a;border:1px solid #2a2a2a;}
    .badge-entregue::before{background:#6a6a8a;}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
    .btn-action{background:#1a1a2e;border:1px solid #2a2a4a;color:#a0a0c0;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
    .btn-action:hover{background:#f97316;border-color:#f97316;color:#fff;}
    .btn-delete{background:transparent;border:1px solid #2a1a1a;color:#4a3a3a;border-radius:8px;padding:6px 8px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;}
    .btn-delete:hover{background:#1a0f0f;border-color:#ef4444;color:#ef4444;}
    .filter-row{display:flex;gap:8px;}
    .filter-btn{padding:6px 14px;border-radius:8px;border:1px solid #2a2a3a;background:transparent;color:#6a6a8a;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
    .filter-btn:hover{border-color:#3a3a5a;color:#a0a0c0;}
    .filter-btn.active{background:#f97316;border-color:#f97316;color:#fff;}
    .cardapio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:20px 22px;}
    .prato-card{background:#0a0a0f;border:1px solid #1e1e2e;border-radius:14px;padding:18px;transition:border-color 0.2s;}
    .prato-card:hover{border-color:#2a2a4a;}
    .prato-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
    .prato-nome{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#e0e0f0;}
    .prato-desc{font-size:12px;color:#4a4a6a;margin-bottom:12px;line-height:1.4;}
    .prato-preco{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#f97316;}
    .search-wrapper{position:relative;display:flex;align-items:center;}
    .search-icon{position:absolute;left:12px;color:#3a3a5a;pointer-events:none;display:flex;}
    .search-input{background:#0a0a0f;border:1px solid #2a2a3a;border-radius:10px;padding:8px 14px 8px 36px;color:#e0e0f0;font-family:'DM Sans',sans-serif;font-size:13px;width:220px;outline:none;transition:border-color 0.15s;}
    .search-input::placeholder{color:#3a3a5a;}
    .search-input:focus{border-color:#f97316;}
    .pagination{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-top:1px solid #1e1e2e;}
    .pagination-info{font-size:12px;color:#4a4a6a;}
    .pagination-btns{display:flex;gap:8px;}
    .page-btn{background:#1a1a2e;border:1px solid #2a2a4a;color:#6a6a8a;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
    .page-btn:hover:not(:disabled){border-color:#f97316;color:#f97316;}
    .page-btn:disabled{opacity:0.3;cursor:not-allowed;}
    .feedback-bar{position:fixed;bottom:24px;right:24px;background:#0f0f1a;border:1px solid #2a2a4a;border-left:3px solid #f97316;border-radius:12px;padding:14px 20px;font-size:13px;color:#e0e0f0;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:999;animation:slideIn 0.2s ease;}
    @keyframes slideIn{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
    .feedback-close{background:transparent;border:none;color:#4a4a6a;cursor:pointer;font-size:16px;padding:0 4px;}
    .feedback-close:hover{color:#e0e0f0;}
    .sit-ok{color:#22c55e;font-size:12px;font-weight:600;}
    .sit-baixo{color:#ef4444;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;}
    .text-muted{color:#8a8aaa;}
    .text-price{color:#22c55e;font-weight:700;font-family:'Syne',sans-serif;}
    .text-id{color:#5a5a7a;font-size:12px;}
    .fw6{font-weight:600;color:#e8e8f8;}
  `}</style>
);

function App() {
  const getPaginaInicial = (nivel) => {
    if (nivel === "cozinha" || nivel === "garcom") return "pedidos";
    return "dashboard";
  };

  const [pagina, setPagina] = useState("dashboard");
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [nomePrato, setNomePrato] = useState("");
  const [descPrato, setDescPrato] = useState("");
  const [precoPrato, setPrecoPrato] = useState("");
  const [nomeIngrediente, setNomeIngrediente] = useState("");
  const [qtdIngrediente, setQtdIngrediente] = useState("");
  const [unidadeIngrediente, setUnidadeIngrediente] = useState("kg");
  const [mensagem, setMensagem] = useState("");
  const [filtroPedido, setFiltroPedido] = useState("todos");
  const [buscaCardapio, setBuscaCardapio] = useState("");
  const [buscaEstoque, setBuscaEstoque] = useState("");
  const [paginaPedidos, setPaginaPedidos] = useState(1);
  const [paginaCardapio, setPaginaCardapio] = useState(1);
  const [paginaEstoque, setPaginaEstoque] = useState(1);
  const ITENS = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nivel = localStorage.getItem("nivel");
    const nome = localStorage.getItem("nome");
    if (tokenValido(token) && nivel && nivel !== "undefined") {
      setUsuario({ token, nivel, nome });
      setPagina(getPaginaInicial(nivel));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("nivel");
      localStorage.removeItem("nome");
    }
  }, []);

  useEffect(() => {
    if (!usuario || !tokenValido(usuario.token)) return;
    buscarDados();
    const i = setInterval(buscarDados, 30000);
    return () => clearInterval(i);
  }, [usuario]);

  async function buscarDados() {
    const token = localStorage.getItem("token");
    if (!tokenValido(token)) return;
    const h = { Authorization: `Bearer ${token}` };
    try {
      const [p, c, e, a] = await Promise.all([
        fetch(`${API}/pedidos/`, { headers: h }).then(r => r.json()),
        fetch(`${API}/cardapio/`, { headers: h }).then(r => r.json()),
        fetch(`${API}/estoque/`, { headers: h }).then(r => r.json()),
        fetch(`${API}/estoque/alerta`, { headers: h }).then(r => r.json()),
      ]);
      setPedidos(Array.isArray(p) ? p : []);
      setCardapio(Array.isArray(c) ? c : []);
      setEstoque(Array.isArray(e) ? e : []);
      setAlertas(Array.isArray(a) ? a : []);
    } catch (err) { console.error(err); }
  }

  function mostrarMensagem(txt) {
    setMensagem(txt);
    setTimeout(() => setMensagem(""), 3000);
  }

  async function atualizarStatus(id, status) {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/pedidos/${id}/status?status=${status}`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` }
      });
      mostrarMensagem(`Pedido #${id} → ${status}`);
      buscarDados();
    } catch { mostrarMensagem("Erro ao atualizar pedido."); }
  }

  async function adicionarPrato(e) {
    e.preventDefault();
    if (!nomePrato || !precoPrato) { mostrarMensagem("Preencha nome e preço."); return; }
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/cardapio/?nome=${nomePrato}&descricao=${descPrato}&preco=${precoPrato}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      setNomePrato(""); setDescPrato(""); setPrecoPrato("");
      mostrarMensagem(`"${nomePrato}" adicionado!`);
      buscarDados();
    } catch { mostrarMensagem("Erro ao adicionar prato."); }
  }

  async function deletarPrato(id, nome) {
    if (!window.confirm(`Deletar "${nome}"?`)) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/cardapio/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      mostrarMensagem(`"${nome}" removido.`);
      buscarDados();
    } catch { mostrarMensagem("Erro ao deletar prato."); }
  }

  async function adicionarIngrediente(e) {
    e.preventDefault();
    if (!nomeIngrediente || !qtdIngrediente) { mostrarMensagem("Preencha nome e quantidade."); return; }
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API}/estoque/?nome=${nomeIngrediente}&quantidade=${qtdIngrediente}&unidade=${unidadeIngrediente}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      setNomeIngrediente(""); setQtdIngrediente(""); setUnidadeIngrediente("kg");
      mostrarMensagem(`"${nomeIngrediente}" adicionado!`);
      buscarDados();
    } catch { mostrarMensagem("Erro ao adicionar ingrediente."); }
  }

  function badgeStatus(s) {
    const m = { "recebido":"badge badge-recebido","em preparo":"badge badge-preparo","pronto":"badge badge-pronto","entregue":"badge badge-entregue" };
    return m[s] || "badge badge-entregue";
  }

  function proximoStatus(s) {
    return { recebido:"em preparo","em preparo":"pronto",pronto:"entregue" }[s] || null;
  }

  const faturamento = pedidos.filter(p => p.status === "entregue").reduce((t, p) => t + (p.total || 0), 0);
  const pedidosAtivos = pedidos.filter(p => p.status !== "entregue").length;

  const pedidosFiltrados = filtroPedido === "todos" ? pedidos : pedidos.filter(p => p.status === filtroPedido);
  const totalPP = Math.ceil(pedidosFiltrados.length / ITENS);
  const pedidosPag = pedidosFiltrados.slice((paginaPedidos - 1) * ITENS, paginaPedidos * ITENS);

  const cardapioFiltrado = cardapio.filter(p => p.nome.toLowerCase().includes(buscaCardapio.toLowerCase()));
  const totalPC = Math.ceil(cardapioFiltrado.length / ITENS);
  const cardapioPag = cardapioFiltrado.slice((paginaCardapio - 1) * ITENS, paginaCardapio * ITENS);

  const estoqueFiltrado = estoque.filter(i => i.nome.toLowerCase().includes(buscaEstoque.toLowerCase()));
  const paginasPermitidas = {
    admin:   ["dashboard","pedidos","cardapio","estoque"],
    cozinha: ["pedidos"],
    garcom:  ["pedidos","cardapio"],
  };

  function Paginacao({ atual, total, onChange }) {
    if (total <= 1) return null;
    return (
      <div className="pagination">
        <span className="pagination-info">Página {atual} de {total}</span>
        <div className="pagination-btns">
          <button className="page-btn" disabled={atual === 1} onClick={() => onChange(atual - 1)}>← Anterior</button>
          <button className="page-btn" disabled={atual === total} onClick={() => onChange(atual + 1)}>Próxima →</button>
        </div>
      </div>
    );
  }

  if (!usuario || !tokenValido(usuario.token)) {
    return (
      <>
        <GlobalStyles />
        <Login onLogin={(data) => {
          const nivel = data.nivel || "admin";
          const token = data.token;
          const nome = data.nome;
          localStorage.setItem("token", token);
          localStorage.setItem("nivel", nivel);
          localStorage.setItem("nome", nome);
          setUsuario({ token, nivel, nome });
          setPagina(getPaginaInicial(nivel));
        }} />
      </>
    );
  }

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:<IconDashboard /> },
    { id:"pedidos",   label:"Pedidos",   icon:<IconPedidos /> },
    { id:"cardapio",  label:"Cardápio",  icon:<IconCardapio /> },
    { id:"estoque",   label:"Estoque",   icon:<IconEstoque /> },
  ].filter(n => (paginasPermitidas[usuario?.nivel] || paginasPermitidas["admin"]).includes(n.id));

  return (
    <>
      <GlobalStyles />
      <div className="app-wrapper">

        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">
              <span className="logo-dot" />
              RestBot
            </div>
            <div className="sidebar-subtitle">Painel Administrativo</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Menu</div>
            {navItems.map(({ id, label, icon }) => (
              <button key={id} className={`nav-btn ${pagina === id ? "active" : ""}`} onClick={() => setPagina(id)}>
                {icon}{label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-info">
                <div className="user-name">{usuario?.nome}</div>
                <div className="user-nivel">{usuario?.nivel}</div>
              </div>
              <button className="logout-btn" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("nivel");
                localStorage.removeItem("nome");
                setUsuario(null);
              }}><IconLogout /></button>
            </div>
          </div>
        </aside>

        <main className="main-content">

          {pagina === "dashboard" && (
            <div>
              <div className="page-header">
                <div className="page-title">Dashboard</div>
                <div className="page-subtitle">Visão geral do dia em tempo real</div>
              </div>
              <div className="cards-grid">
                <div className="stat-card c-orange">
                  <div className="stat-label">Total de Pedidos</div>
                  <div className="stat-value c-orange">{pedidos.length}</div>
                </div>
                <div className="stat-card c-yellow">
                  <div className="stat-label">Pedidos Ativos</div>
                  <div className="stat-value c-yellow">{pedidosAtivos}</div>
                </div>
                <div className="stat-card c-green">
                  <div className="stat-label">Faturamento</div>
                  <div className="stat-value c-green">R$ {faturamento.toFixed(2)}</div>
                </div>
                <div className="stat-card c-red">
                  <div className="stat-label">Alertas Estoque</div>
                  <div className="stat-value c-red">{alertas.length}</div>
                </div>
              </div>
              {alertas.length > 0 && (
                <div className="alert-box">
                  <div className="alert-title"><IconAlert /> Estoque Crítico</div>
                  <div className="alert-grid">
                    {alertas.map(item => (
                      <div key={item.id} className="alert-item">
                        <span className="alert-item-name">{item.nome}</span>
                        <span className="alert-item-qty">{item.quantidade} {item.unidade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {pagina === "pedidos" && (
            <div>
              <div className="page-header-row">
                <div>
                  <div className="page-title">Pedidos</div>
                  <div className="page-subtitle">{pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} registrado{pedidos.length !== 1 ? "s" : ""}</div>
                </div>
                <div className="filter-row">
                  {["todos","recebido","em preparo","pronto","entregue"].map(s => (
                    <button key={s} className={`filter-btn ${filtroPedido === s ? "active" : ""}`}
                      onClick={() => { setFiltroPedido(s); setPaginaPedidos(1); }}>
                      {s === "todos" ? `Todos (${pedidos.length})` : s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="panel-box">
                <table className="data-table">
                  <thead><tr>{["#","Mesa","Itens","Total","Status","Ação"].map(h => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {pedidosPag.length === 0
                      ? <tr className="empty-row"><td colSpan={6}>Nenhum pedido encontrado.</td></tr>
                      : pedidosPag.map(pedido => (
                        <tr key={pedido.id}>
                          <td className="text-id">#{pedido.id}</td>
                          <td className="fw6">Mesa {pedido.mesa_id}</td>
                          <td className="text-muted">{pedido.itens}</td>
                          <td className="text-price">R$ {Number(pedido.total || 0).toFixed(2)}</td>
                          <td><span className={badgeStatus(pedido.status)}>{pedido.status}</span></td>
                          <td>
                            {proximoStatus(pedido.status) && (
                              <button className="btn-action" onClick={() => atualizarStatus(pedido.id, proximoStatus(pedido.status))}>
                                → {proximoStatus(pedido.status)}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <Paginacao atual={paginaPedidos} total={totalPP} onChange={setPaginaPedidos} />
              </div>
            </div>
          )}

          {pagina === "cardapio" && (
            <div>
              <div className="page-header-row">
                <div>
                  <div className="page-title">Cardápio</div>
                  <div className="page-subtitle">{cardapio.length} prato{cardapio.length !== 1 ? "s" : ""} cadastrado{cardapio.length !== 1 ? "s" : ""}</div>
                </div>
                <div className="search-wrapper">
                  <span className="search-icon"><IconSearch /></span>
                  <input className="search-input" type="text" placeholder="Buscar prato..."
                    value={buscaCardapio} onChange={e => { setBuscaCardapio(e.target.value); setPaginaCardapio(1); }} />
                </div>
              </div>
              <div className="panel-box" style={{marginBottom:"20px"}}>
                <div className="panel-box-header"><span className="panel-box-title">Adicionar novo prato</span></div>
                <form onSubmit={adicionarPrato} className="form-row">
                  <input className="input-field" type="text" placeholder="Nome do prato" value={nomePrato} onChange={e => setNomePrato(e.target.value)} />
                  <input className="input-field" type="text" placeholder="Descrição (opcional)" value={descPrato} onChange={e => setDescPrato(e.target.value)} />
                  <input className="input-field input-sm" type="number" placeholder="Preço" value={precoPrato} onChange={e => setPrecoPrato(e.target.value)} step="0.01" />
                  <button type="submit" className="btn-primary">+ Adicionar</button>
                </form>
              </div>
              <div className="cardapio-grid">
                {cardapioPag.length === 0
                  ? <p style={{color:"#3a3a5a",gridColumn:"1/-1",padding:"40px 0",textAlign:"center"}}>Nenhum prato cadastrado.</p>
                  : cardapioPag.map(prato => (
                    <div key={prato.id} className="prato-card">
                      <div className="prato-card-header">
                        <div className="prato-nome">{prato.nome}</div>
                        <button className="btn-delete" onClick={() => deletarPrato(prato.id, prato.nome)}><IconTrash /></button>
                      </div>
                      {prato.descricao && <div className="prato-desc">{prato.descricao}</div>}
                      <div className="prato-preco">R$ {Number(prato.preco || 0).toFixed(2)}</div>
                    </div>
                  ))
                }
              </div>
              {totalPC > 1 && (
                <div className="panel-box" style={{marginTop:"16px"}}>
                  <Paginacao atual={paginaCardapio} total={totalPC} onChange={setPaginaCardapio} />
                </div>
              )}
            </div>
          )}

          {pagina === "estoque" && (
            <div>
              <div className="page-header-row">
                <div>
                  <div className="page-title">Estoque</div>
                  <div className="page-subtitle">{estoque.length} ingrediente{estoque.length !== 1 ? "s" : ""} cadastrado{estoque.length !== 1 ? "s" : ""}</div>
                </div>
                <div className="search-wrapper">
                  <span className="search-icon"><IconSearch /></span>
                  <input className="search-input" type="text" placeholder="Buscar ingrediente..."
                    value={buscaEstoque} onChange={e => { setBuscaEstoque(e.target.value); setPaginaEstoque(1); }} />
                </div>
              </div>
              <div className="panel-box" style={{marginBottom:"20px"}}>
                <div className="panel-box-header"><span className="panel-box-title">Adicionar ingrediente</span></div>
                <form onSubmit={adicionarIngrediente} className="form-row">
                  <input className="input-field" type="text" placeholder="Nome do ingrediente" value={nomeIngrediente} onChange={e => setNomeIngrediente(e.target.value)} />
                  <input className="input-field input-sm" type="number" placeholder="Quantidade" value={qtdIngrediente} onChange={e => setQtdIngrediente(e.target.value)} />
                  <select className="input-field" style={{width:"120px",flex:"none"}} value={unidadeIngrediente} onChange={e => setUnidadeIngrediente(e.target.value)}>
                    <option value="kg">kg</option>
                    <option value="litro">litro</option>
                    <option value="unidade">unidade</option>
                    <option value="pacote">pacote</option>
                  </select>
                  <button type="submit" className="btn-primary">+ Adicionar</button>
                </form>
              </div>
              <div className="panel-box">
                <table className="data-table">
                  <thead><tr>{["#","Ingrediente","Quantidade","Unidade","Situação"].map(h => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {estoqueFiltrado.length === 0
                      ? <tr className="empty-row"><td colSpan={5}>Nenhum ingrediente cadastrado.</td></tr>
                      : estoqueFiltrado.map(item => {
                        const baixo = item.quantidade <= 5;
                        return (
                          <tr key={item.id} className={baixo ? "row-alert" : ""}>
                            <td className="text-id">{item.id}</td>
                            <td className="fw6">{item.nome}</td>
                            <td style={{fontWeight:600,color:baixo?"#ef4444":"#e8e8f8"}}>{item.quantidade}</td>
                            <td className="text-muted">{item.unidade}</td>
                            <td>
                              {baixo
                                ? <span className="sit-baixo"><IconAlert /> Estoque baixo</span>
                                : <span className="sit-ok">✓ OK</span>}
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>

        {mensagem && (
          <div className="feedback-bar">
            <span>{mensagem}</span>
            <button className="feedback-close" onClick={() => setMensagem("")}>✕</button>
          </div>
        )}

      </div>
    </>
  );
}

export default App;
