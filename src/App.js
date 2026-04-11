import { useState, useEffect } from "react";
import Login from "./pages/Login";

// URL base do backend FastAPI
const API = "https://restaurante-bot-production-b7f0.up.railway.app";

function App() {
  // ==================== ESTADOS ====================

  // Controla qual página está sendo exibida no painel
  const [pagina, setPagina] = useState("dashboard");
  const [usuario, setUsuario] = useState(null);


  // Listas de dados vindos do backend
  const [pedidos, setPedidos] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [alertas, setAlertas] = useState([]);

  // Campos do formulário de novo prato
  const [nomePrato, setNomePrato] = useState("");
  const [descPrato, setDescPrato] = useState("");
  const [precoPrato, setPrecoPrato] = useState("");

  // Campos do formulário de novo ingrediente
  const [nomeIngrediente, setNomeIngrediente] = useState("");
  const [qtdIngrediente, setQtdIngrediente] = useState("");
  const [unidadeIngrediente, setUnidadeIngrediente] = useState("kg");

  // Mensagem de feedback para o usuário (some após 3 segundos)
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    const nome  = localStorage.getItem("nome");
    if (token) setUsuario({ token, role, nome });
  }, []);

  // ==================== EFEITO INICIAL ====================

  useEffect(() => {
    // Busca os dados imediatamente quando o painel abre
    buscarDados();

    // Atualização automática a cada 30 segundos
    const intervalo = setInterval(buscarDados, 30000);

    // Limpeza: cancela o intervalo quando o componente sai da tela
    return () => clearInterval(intervalo);
  }, []); // [] = executa só uma vez ao carregar

  // ==================== FUNÇÕES ====================

  async function buscarDados() {
    try {
      // Promise.all faz as 4 requisições ao mesmo tempo (mais rápido)
      const [p, c, e, a] = await Promise.all([
        fetch(`${API}/pedidos/`).then((r) => r.json()),
        fetch(`${API}/cardapio/`).then((r) => r.json()),
        fetch(`${API}/estoque/`).then((r) => r.json()),
        fetch(`${API}/estoque/alerta`).then((r) => r.json()),
      ]);
      // Array.isArray evita erro se o backend retornar algo inesperado
      setPedidos(Array.isArray(p) ? p : []);
      setCardapio(Array.isArray(c) ? c : []);
      setEstoque(Array.isArray(e) ? e : []);
      setAlertas(Array.isArray(a) ? a : []);
    } catch (erro) {
      console.error("Erro ao buscar dados:", erro);
    }
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3000);
  }

  async function atualizarStatus(pedidoId, novoStatus) {
    try {
      await fetch(`${API}/pedidos/${pedidoId}/status?status=${novoStatus}`, {
        method: "PUT",
      });
      mostrarMensagem(`Pedido #${pedidoId} → ${novoStatus}`);
      buscarDados();
    } catch {
      mostrarMensagem("Erro ao atualizar pedido.");
    }
  }

  async function adicionarPrato(e) {
    e.preventDefault();
    if (!nomePrato || !precoPrato) {
      mostrarMensagem("Preencha o nome e o preço.");
      return;
    }
    try {
      await fetch(
          `${API}/cardapio/?nome=${nomePrato}&descricao=${descPrato}&preco=${precoPrato}`,
          { method: "POST" }
      );
      setNomePrato(""); setDescPrato(""); setPrecoPrato("");
      mostrarMensagem(`"${nomePrato}" adicionado ao cardápio!`);
      buscarDados();
    } catch {
      mostrarMensagem("Erro ao adicionar prato.");
    }
  }

  async function deletarPrato(id, nome) {
    if (!window.confirm(`Deletar "${nome}"?`)) return;
    try {
      await fetch(`${API}/cardapio/${id}`, { method: "DELETE" });
      mostrarMensagem(`"${nome}" removido do cardápio.`);
      buscarDados();
    } catch {
      mostrarMensagem("Erro ao deletar prato.");
    }
  }

  async function adicionarIngrediente(e) {
    e.preventDefault();
    if (!nomeIngrediente || !qtdIngrediente) {
      mostrarMensagem("Preencha o nome e a quantidade.");
      return;
    }
    try {
      await fetch(
          `${API}/estoque/?nome=${nomeIngrediente}&quantidade=${qtdIngrediente}&unidade=${unidadeIngrediente}`,
          { method: "POST" }
      );
      setNomeIngrediente(""); setQtdIngrediente(""); setUnidadeIngrediente("kg");
      mostrarMensagem(`"${nomeIngrediente}" adicionado ao estoque!`);
      buscarDados();
    } catch {
      mostrarMensagem("Erro ao adicionar ingrediente.");
    }
  }

  // Retorna as classes CSS de cor para o badge de status
  function corStatus(status) {
    const cores = {
      recebido: "bg-yellow-100 text-yellow-800",
      "em preparo": "bg-blue-100 text-blue-800",
      pronto: "bg-green-100 text-green-800",
      entregue: "bg-gray-100 text-gray-600",
    };
    return cores[status] || "bg-gray-100 text-gray-600";
  }

  // Retorna qual é o próximo status no fluxo do pedido
  function proximoStatus(status) {
    const fluxo = { recebido: "em preparo", "em preparo": "pronto", pronto: "entregue" };
    return fluxo[status] || null; // null = pedido já foi entregue, não tem próximo
  }

  // Cálculos do dashboard
  const faturamento = pedidos
      .filter((p) => p.status === "entregue")
      .reduce((total, p) => total + (p.total || 0), 0);
  const pedidosAtivos = pedidos.filter((p) => p.status !== "entregue").length;

  // ==================== RENDER ====================

  if (!usuario) return <Login onLogin={(data) => setUsuario({ token: data.access_token, role: data.role, nome: data.nome })} />;

  return (
      <div className="min-h-screen bg-gray-100">

        {/* HEADER */}
        <header className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold">🍕 Restaurante-Bot | Painel</h1>
          <div className="flex items-center gap-4">
            <span className="text-green-200 text-sm">
              Olá, {usuario?.nome} ({usuario?.role})
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("nome");
                setUsuario(null);
              }}
              className="bg-green-800 hover:bg-green-900 text-white text-sm px-3 py-1 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </header>

        {/* NAVEGAÇÃO */}
        <nav className="bg-white shadow px-6 py-2 flex gap-4">
          {[
            { id: "dashboard", icone: "📊" },
            { id: "pedidos", icone: "🧾" },
            { id: "cardapio", icone: "🍽️" },
            { id: "estoque", icone: "📦" },
          ].map(({ id, icone }) => (
              <button
                  key={id}
                  onClick={() => setPagina(id)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                      pagina === id
                          ? "bg-green-700 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {icone} {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
          ))}
        </nav>

        {/* MENSAGEM DE FEEDBACK */}
        {mensagem && (
            <div className="max-w-7xl mx-auto mt-4 px-6">
              <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex justify-between">
                <span>{mensagem}</span>
                <button onClick={() => setMensagem("")} className="font-bold ml-4">✕</button>
              </div>
            </div>
        )}

        <main className="max-w-7xl mx-auto p-6">

          {/* ===== DASHBOARD ===== */}
          {pagina === "dashboard" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Resumo do dia</h2>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl shadow p-6 text-center">
                    <p className="text-gray-500 text-sm">Total de Pedidos</p>
                    <p className="text-3xl font-bold text-green-700">{pedidos.length}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 text-center">
                    <p className="text-gray-500 text-sm">Pedidos Ativos</p>
                    <p className="text-3xl font-bold text-yellow-500">{pedidosAtivos}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 text-center">
                    <p className="text-gray-500 text-sm">Faturamento</p>
                    <p className="text-3xl font-bold text-green-700">R$ {faturamento.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 text-center">
                    <p className="text-gray-500 text-sm">Alertas Estoque</p>
                    <p className="text-3xl font-bold text-red-500">{alertas.length}</p>
                  </div>
                </div>
                {alertas.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h3 className="font-bold text-red-700 mb-2">⚠️ Estoque Baixo</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {alertas.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg p-3 border border-red-200">
                              <span className="font-medium text-red-700">{item.nome}</span>
                              <span className="text-sm text-gray-500 ml-2">
                        {item.quantidade} {item.unidade}
                      </span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* ===== PEDIDOS ===== */}
          {pagina === "pedidos" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Pedidos</h2>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                      {["#", "Mesa", "Itens", "Total", "Status", "Ação"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-gray-600 text-sm">{h}</th>
                      ))}
                    </tr>
                    </thead>
                    <tbody>
                    {pedidos.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-gray-400 py-8">Nenhum pedido encontrado.</td></tr>
                    ) : (
                        pedidos.map((pedido) => (
                            <tr key={pedido.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-500">#{pedido.id}</td>
                              <td className="px-4 py-3 font-medium">Mesa {pedido.mesa_id}</td>
                              <td className="px-4 py-3 text-gray-600 text-sm">{pedido.itens}</td>
                              <td className="px-4 py-3 font-medium text-green-700">
                                R$ {Number(pedido.total || 0).toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${corStatus(pedido.status)}`}>
                            {pedido.status}
                          </span>
                              </td>
                              <td className="px-4 py-3">
                                {proximoStatus(pedido.status) && (
                                    <button
                                        onClick={() => atualizarStatus(pedido.id, proximoStatus(pedido.status))}
                                        className="bg-green-700 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-800 transition"
                                    >
                                      → {proximoStatus(pedido.status)}
                                    </button>
                                )}
                              </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

          {/* ===== CARDÁPIO ===== */}
          {pagina === "cardapio" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Cardápio</h2>
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h3 className="font-bold text-gray-700 mb-4">Adicionar novo prato</h3>
                  <form onSubmit={adicionarPrato} className="flex gap-4 flex-wrap">
                    <input type="text" placeholder="Nome do prato" value={nomePrato}
                           onChange={(e) => setNomePrato(e.target.value)}
                           className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-40" />
                    <input type="text" placeholder="Descrição (opcional)" value={descPrato}
                           onChange={(e) => setDescPrato(e.target.value)}
                           className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-40" />
                    <input type="number" placeholder="Preço (ex: 29.90)" value={precoPrato}
                           onChange={(e) => setPrecoPrato(e.target.value)}
                           className="border rounded-lg px-3 py-2 text-sm w-40" step="0.01" />
                    <button type="submit"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition">
                      + Adicionar Prato
                    </button>
                  </form>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {cardapio.length === 0 ? (
                      <p className="text-gray-400 col-span-3">Nenhum prato cadastrado.</p>
                  ) : (
                      cardapio.map((prato) => (
                          <div key={prato.id} className="bg-white rounded-xl shadow p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-gray-800">{prato.nome}</h3>
                              <button onClick={() => deletarPrato(prato.id, prato.nome)}
                                      className="text-red-400 hover:text-red-600 transition" title="Deletar">
                                🗑️
                              </button>
                            </div>
                            {prato.descricao && <p className="text-gray-500 text-sm mt-1">{prato.descricao}</p>}
                            <p className="text-green-700 font-bold mt-2">
                              R$ {Number(prato.preco || 0).toFixed(2)}
                            </p>
                          </div>
                      ))
                  )}
                </div>
              </div>
          )}

          {/* ===== ESTOQUE ===== */}
          {pagina === "estoque" && (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Estoque</h2>
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h3 className="font-bold text-gray-700 mb-4">Adicionar ingrediente</h3>
                  <form onSubmit={adicionarIngrediente} className="flex gap-4 flex-wrap">
                    <input type="text" placeholder="Nome do ingrediente" value={nomeIngrediente}
                           onChange={(e) => setNomeIngrediente(e.target.value)}
                           className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-40" />
                    <input type="number" placeholder="Quantidade" value={qtdIngrediente}
                           onChange={(e) => setQtdIngrediente(e.target.value)}
                           className="border rounded-lg px-3 py-2 text-sm w-32" />
                    <select value={unidadeIngrediente} onChange={(e) => setUnidadeIngrediente(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm w-28">
                      <option value="kg">kg</option>
                      <option value="litro">litro</option>
                      <option value="unidade">unidade</option>
                      <option value="pacote">pacote</option>
                    </select>
                    <button type="submit"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition">
                      + Adicionar
                    </button>
                  </form>
                </div>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                      {["#", "Ingrediente", "Quantidade", "Unidade", "Situação"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-gray-600 text-sm">{h}</th>
                      ))}
                    </tr>
                    </thead>
                    <tbody>
                    {estoque.length === 0 ? (
                        <tr><td colSpan={5} className="text-center text-gray-400 py-8">Nenhum ingrediente cadastrado.</td></tr>
                    ) : (
                        estoque.map((item) => {
                          const baixo = item.quantidade <= 5;
                          return (
                              <tr key={item.id} className={`border-b ${baixo ? "bg-red-50" : "hover:bg-gray-50"}`}>
                                <td className="px-4 py-3 text-gray-500">{item.id}</td>
                                <td className="px-4 py-3 font-medium">{item.nome}</td>
                                <td className="px-4 py-3">{item.quantidade}</td>
                                <td className="px-4 py-3 text-gray-500">{item.unidade}</td>
                                <td className="px-4 py-3">
                                  {baixo
                                      ? <span className="text-red-600 text-sm font-medium">⚠️ Estoque baixo</span>
                                      : <span className="text-green-600 text-sm">✓ OK</span>
                                  }
                                </td>
                              </tr>
                          );
                        })
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

        </main>
      </div>
  );
}

export default App;