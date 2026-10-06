// ============================================================
//  EMU — db.js  v2  (MySQL via API PHP)
//  Substitui o db.js original que usava localStorage
//  API Base: http://localhost:9999/emu/api.php
// ============================================================

const API = `${location.origin}${location.pathname.replace(/\/[^/]*$/, '')}/api.php`;

async function _req(recurso, metodo = 'GET', body = null, id = null, extra = '') {
  let url = `${API}?recurso=${recurso}`;
  if (id) url += `&id=${id}`;
  if (extra) url += extra.startsWith('&') ? extra : (extra ? `&${extra}` : '');
  const opts = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch {
    throw new Error(text.slice(0, 200) || 'Resposta inválida da API');
  }
  if (data.erro) throw new Error(data.erro);
  return data;
}

// ── DB global ────────────────────────────────────────────────
const DB = {

  OS: {
    listar: (status) => _req('os', 'GET', null, null, status ? `status=${status}` : ''),
    buscar: (id)     => _req('os', 'GET', null, id),
    criar:  (d)      => _req('os', 'POST', d),
    atualizar: (id, d) => _req('os', 'PUT', d, id),
    excluir: (id)    => _req('os', 'DELETE', null, id),
  },

  Estoque: {
    listar:  (cat)   => _req('estoque', 'GET', null, null, cat ? `categoria=${encodeURIComponent(cat)}` : ''),
    buscar:  (id)    => _req('estoque', 'GET', null, id),
    criar:   (d)     => _req('estoque', 'POST', d),
    atualizar: (id, d) => _req('estoque', 'PUT', d, id),
    excluir: (id)    => _req('estoque', 'DELETE', null, id),
    criticos: ()     => _req('estoque', 'GET', null, null, 'sub=critico'),
  },

  Notas: {
    listar:  (status) => _req('notas', 'GET', null, null, status ? `status=${status}` : ''),
    buscar:  (id)     => _req('notas', 'GET', null, id),
    criar:   (d)      => _req('notas', 'POST', d),
    atualizar: (id, d) => _req('notas', 'PUT', d, id),
    excluir: (id)     => _req('notas', 'DELETE', null, id),
  },

  Clientes: {
    listar:  (busca)  => _req('clientes', 'GET', null, null, busca ? `busca=${encodeURIComponent(busca)}` : ''),
    buscar:  (id)     => _req('clientes', 'GET', null, id),
    criar:   (d)      => _req('clientes', 'POST', d),
    atualizar: (id, d) => _req('clientes', 'PUT', d, id),
    excluir: (id)     => _req('clientes', 'DELETE', null, id),
  },

  Fornecedores: {
    listar:  ()       => _req('fornecedores', 'GET'),
    buscar:  (id)     => _req('fornecedores', 'GET', null, id),
    criar:   (d)      => _req('fornecedores', 'POST', d),
    atualizar: (id, d) => _req('fornecedores', 'PUT', d, id),
    excluir: (id)     => _req('fornecedores', 'DELETE', null, id),
  },

  Funcionarios: {
    listar:  ()       => _req('funcionarios', 'GET'),
    buscar:  (id)     => _req('funcionarios', 'GET', null, id),
    criar:   (d)      => _req('funcionarios', 'POST', d),
    atualizar: (id, d) => _req('funcionarios', 'PUT', d, id),
    excluir: (id)     => _req('funcionarios', 'DELETE', null, id),
  },

  Dashboard: {
    stats: () => _req('dashboard', 'GET'),
  },

  Usuarios: {
    listar:  ()       => _req('usuarios', 'GET'),
    buscar:  (id)     => _req('usuarios', 'GET', null, id),
    criar:   (d)      => _req('usuarios', 'POST', d),
    atualizar: (id, d) => _req('usuarios', 'PUT', d, id),
    excluir: (id)     => _req('usuarios', 'DELETE', null, id),
  },

  Cargos: {
    listar:  ()       => _req('cargos', 'GET'),
    buscar:  (id)     => _req('cargos', 'GET', null, id),
    criar:   (d)      => _req('cargos', 'POST', d),
    atualizar: (id, d) => _req('cargos', 'PUT', d, id),
    excluir: (id)     => _req('cargos', 'DELETE', null, id),
  },
};

// ── Auth (mantém sessionStorage para sessão de aba) ──────────
const Auth = {
  login: async (email, senha) => {
    const res = await _req('login', 'POST', { email, senha });
    if (res.ok) {
      sessionStorage.setItem('emu_auth', JSON.stringify(res.usuario));
      return res.usuario;
    }
    return null;
  },
  salvar:  (u) => sessionStorage.setItem('emu_auth', JSON.stringify(u)),
  atual:   ()  => { try { return JSON.parse(sessionStorage.getItem('emu_auth')); } catch { return null; } },
  logout:  ()  => { sessionStorage.removeItem('emu_auth'); window.location.href = 'login.html'; },
  exigir:  ()  => { if (!Auth.atual()) { window.location.href = 'login.html'; return false; } return true; },
};

// ── UI helpers (iguais ao original) ─────────────────────────
function toast(msg, tipo = 'ok') {
  const t = document.createElement('div');
  const ok = tipo === 'ok';
  t.className = `toast-emu fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-lg text-sm font-semibold shadow-2xl transition-all ${ok ? 'bg-[#ffb4ac] text-[#86000c]' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`;
  t.innerHTML = `<span class="material-symbols-outlined text-base">${ok ? 'check_circle' : 'error'}</span><span>${esc(msg)}</span>`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800);
}
function confirmar(msg) { return window.confirm(msg); }
function esc(s)    { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function fmt(n)    { return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function fmtData(iso) { if (!iso) return ''; const [y, m, d] = iso.split('T')[0].split('-'); return `${d}/${m}/${y}`; }
