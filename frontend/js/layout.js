// Layout compartilhado - sidebar + topbar + design helpers

function renderLayout(paginaAtiva) {
  const usuario = Auth.atual() || { nome: 'Usuário', cargo: '' };
  const nav = [
    { href: 'dashboard.html', icon: 'dashboard', label: 'Dashboard' },
    { href: 'os.html', icon: 'build', label: 'Ordens de Serviço' },
    { href: 'estoque.html', icon: 'inventory_2', label: 'Estoque' },
    { href: 'notas.html', icon: 'receipt_long', label: 'Notas Fiscais' },
    { href: 'clientes.html', icon: 'people', label: 'Clientes' },
    { href: 'fornecedores.html', icon: 'local_shipping', label: 'Fornecedores' },
    { href: 'funcionarios.html', icon: 'badge', label: 'Funcionários' },
    { href: 'cargos.html', icon: 'work', label: 'Cargos' },
    { href: 'usuarios.html', icon: 'manage_accounts', label: 'Usuários' },
  ];
  const navHTML = nav.map(item => {
    const ativo = item.href === paginaAtiva;
    return `<a href="${item.href}" class="nav-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${ativo ? 'bg-[#93000e]/20 text-[#ffb4ac] font-semibold border-r-2 border-[#ffb4ac]' : 'text-[#acabaa] hover:text-white hover:bg-[#1f2020]'}">
      <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
      ${item.label}
    </a>`;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <div id="sidebar-overlay" class="fixed inset-0 z-40 bg-black/60 lg:hidden" onclick="fecharSidebar()"></div>
    <aside id="sidebar" class="fixed left-0 top-0 h-screen w-60 bg-[#0e0e0e] border-r border-[#484848]/20 flex flex-col py-6 px-3 z-50">
      <div class="px-3 mb-6 flex items-center justify-between">
        <div>
          <div class="text-2xl font-black text-[#ffb4ac] tracking-tighter uppercase">EMU</div>
          <div class="text-[10px] text-[#acabaa] uppercase tracking-widest mt-0.5">Oficina de Precisão</div>
        </div>
        <button type="button" class="lg:hidden text-[#acabaa] hover:text-white p-1" onclick="fecharSidebar()" aria-label="Fechar menu">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav class="flex-1 space-y-1 overflow-y-auto">${navHTML}</nav>
      <div class="mt-auto pt-4 border-t border-[#484848]/20 px-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-full bg-[#93000e]/30 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[#ffb4ac] text-sm">person</span>
          </div>
          <p id="sidebar-user-name" class="flex-1 min-w-0 text-sm font-bold text-white truncate" title="${esc(usuario.nome || usuario.email || '')}">${esc(usuario.nome || usuario.email || 'Usuário')}</p>
          <button type="button" onclick="Auth.logout()" title="Sair" class="shrink-0 text-[#acabaa] hover:text-[#ffb4ac] transition-colors" aria-label="Sair">
            <span class="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
        ${usuario.cargo ? `<p class="text-[10px] text-[#acabaa] mt-1 pl-11 truncate">${esc(usuario.cargo)}</p>` : ''}
      </div>
    </aside>
    <div id="main-wrap" class="main-content ml-0 lg:ml-60 min-h-screen">
      <header class="sticky top-0 z-40 h-14 bg-[#0e0e0e]/90 backdrop-blur border-b border-[#484848]/20 flex items-center justify-between px-4 lg:px-6 gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <button type="button" class="lg:hidden text-[#acabaa] hover:text-white shrink-0" onclick="abrirSidebar()" aria-label="Abrir menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <h2 id="page-title" class="text-sm font-semibold text-white truncate"></h2>
        </div>
        <div class="flex items-center gap-2 text-xs text-[#acabaa] shrink-0">
          <span class="material-symbols-outlined text-sm hidden sm:inline">calendar_today</span>
          <span id="data-header" class="hidden sm:inline"></span>
          <span class="hidden sm:inline text-[#484848]">·</span>
          <span class="material-symbols-outlined text-sm">schedule</span>
          <span id="relogio"></span>
        </div>
      </header>
      <main class="p-4 lg:p-6" id="conteudo"></main>
    </div>
  `);

  function tick() {
    const el = document.getElementById('relogio');
    const dataEl = document.getElementById('data-header');
    const now = new Date();
    if (el) el.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (dataEl) {
      dataEl.textContent = now.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  }
  tick();
  setInterval(tick, 60000);

  const paginaAtual = nav.find(n => n.href === paginaAtiva);
  const titulo = document.getElementById('page-title');
  if (titulo && paginaAtual) titulo.textContent = paginaAtual.label;
}

window.abrirSidebar = function () {
  document.getElementById('sidebar')?.classList.add('sidebar-open');
  document.getElementById('sidebar-overlay')?.classList.add('active');
};
window.fecharSidebar = function () {
  document.getElementById('sidebar')?.classList.remove('sidebar-open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
};

function panel(titulo, icone, conteudo, extraClass = '') {
  return `<div class="panel panel-padded ${extraClass}">
    <div class="panel-header">
      ${icone ? `<span class="material-symbols-outlined text-[#ffb4ac]">${icone}</span>` : ''}
      <span>${titulo}</span>
    </div>
    ${conteudo}
  </div>`;
}

function kpiCard({ icon, label, value, href, variant = '', iconColor = 'text-[#ffb4ac]' }) {
  const tag = href ? 'a' : 'div';
  const cls = `kpi-card ${variant === 'alert' ? 'kpi-card--alert' : ''}`;
  return `<${tag} ${href ? `href="${href}"` : ''} class="${cls}">
    <div class="kpi-card__label">
      <span class="material-symbols-outlined text-lg ${iconColor}">${icon}</span>
      <span>${label}</span>
    </div>
    <p class="kpi-card__value">${value}</p>
  </${tag}>`;
}

function emptyState(msg, icone = 'inbox') {
  return `<div class="empty-state">
    <div><span class="material-symbols-outlined">${icone}</span></div>
    <p class="text-sm">${esc(msg)}</p>
  </div>`;
}

function pageToolbar(buscaHtml, acoesHtml) {
  return `<div class="flex flex-wrap items-center justify-between gap-3 mb-5">
    <div class="flex-1 min-w-[200px]">${buscaHtml || ''}</div>
    <div class="flex flex-wrap items-center gap-2">${acoesHtml || ''}</div>
  </div>`;
}

function chipsHtml(filtros, ativo, callbackName) {
  return `<div class="chips-row">${filtros.map(([val, label]) =>
    `<button type="button" class="chip-filtro ${ativo === val ? 'chip-filtro--ativo' : ''}" onclick="${callbackName}('${val}')">${esc(label)}</button>`
  ).join('')}</div>`;
}

function skeletonDashboard() {
  return `<div class="space-y-6">
    <div class="skeleton h-16 rounded-xl"></div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${Array(8).fill('<div class="skeleton skeleton-kpi"></div>').join('')}</div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="skeleton skeleton-panel"></div>
      <div class="skeleton skeleton-panel"></div>
    </div>
  </div>`;
}

function skeletonTable(rows = 5) {
  return `<div class="panel p-4 space-y-3">${Array(rows).fill('<div class="skeleton h-10 rounded-lg"></div>').join('')}</div>`;
}

function statusLabelOs(s) {
  return { pendente: 'Pendente', em_execucao: 'Em Execução', finalizado: 'Finalizado', cancelado: 'Cancelado' }[s] || s;
}

function statusLabelNota(s) {
  return { emitida: 'Emitida', paga: 'Paga', cancelada: 'Cancelada' }[s] || s;
}

function prioCor(p) {
  return { alta: 'prio-alta', media: 'prio-media', baixa: 'prio-baixa' }[p] || '';
}

function stockBarHtml(qtd, min) {
  const pct = min > 0 ? Math.min(100, Math.round((qtd / min) * 100)) : (qtd > 0 ? 100 : 0);
  const cls = qtd <= min ? 'stock-bar__fill--crit' : (pct < 150 ? 'stock-bar__fill--warn' : 'stock-bar__fill--ok');
  return `<div class="stock-bar" title="${qtd} / mín. ${min}"><div class="stock-bar__fill ${cls}" style="width:${pct}%"></div></div>`;
}

function abrirModal(titulo, conteudo, onSalvar, opcoes = {}) {
  document.getElementById('modal-emu')?.remove();
  const wide = opcoes.wide ? 'modal-box--wide' : '';
  const scroll = opcoes.scroll ? 'modal-body-scroll' : '';
  const m = document.createElement('div');
  m.id = 'modal-emu';
  m.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-[#131313] border border-[#484848]/30 rounded-xl w-full max-w-lg shadow-2xl ${wide}">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#484848]/20">
          <h3 class="font-bold text-white">${titulo}</h3>
          <button type="button" id="fechar-modal" class="text-[#acabaa] hover:text-white" aria-label="Fechar"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-6 space-y-4 ${scroll}">${conteudo}</div>
        <div class="flex gap-3 px-6 py-4 border-t border-[#484848]/20">
          <button type="button" id="cancelar-modal" class="flex-1 py-2 border border-[#484848]/40 text-[#acabaa] text-sm rounded-lg hover:bg-[#1f2020] transition-colors">Cancelar</button>
          <button type="button" id="salvar-modal" class="flex-1 py-2 bg-[#ffb4ac] text-[#86000c] text-sm font-bold rounded-lg hover:brightness-110 transition-all">Salvar</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(m);
  m.querySelector('#fechar-modal').onclick = () => m.remove();
  m.querySelector('#cancelar-modal').onclick = () => m.remove();
  m.querySelector('#salvar-modal').onclick = async () => {
    const ok = await Promise.resolve(onSalvar());
    if (ok) m.remove();
  };
  m.addEventListener('click', e => { if (e.target === m.firstElementChild) m.remove(); });
}

function campo(label, id, tipo = 'text', valor = '', extras = '') {
  return `<div>
    <label class="block text-xs font-semibold text-[#acabaa] uppercase tracking-wider mb-1">${label}</label>
    <input id="${id}" type="${tipo}" value="${esc(valor)}" ${extras}
      class="w-full bg-[#000] border border-[#484848]/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#484848] focus:border-[#ffb4ac] focus:outline-none transition-colors">
  </div>`;
}

function select(label, id, opcoes, valor = '') {
  const opts = opcoes.map(([v, l]) => `<option value="${v}" ${String(v) === String(valor) ? 'selected' : ''}>${esc(l)}</option>`).join('');
  return `<div>
    <label class="block text-xs font-semibold text-[#acabaa] uppercase tracking-wider mb-1">${label}</label>
    <select id="${id}" class="w-full bg-[#000] border border-[#484848]/40 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ffb4ac] focus:outline-none transition-colors">${opts}</select>
  </div>`;
}

function textarea(label, id, valor = '') {
  return `<div>
    <label class="block text-xs font-semibold text-[#acabaa] uppercase tracking-wider mb-1">${label}</label>
    <textarea id="${id}" rows="3" class="w-full bg-[#000] border border-[#484848]/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#484848] focus:border-[#ffb4ac] focus:outline-none transition-colors resize-none">${esc(valor)}</textarea>
  </div>`;
}

function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

async function opcoesCargos(valorSelecionado = '', labelVazio = 'Selecione o cargo...') {
  const lista = await DB.Cargos.listar();
  return [['', labelVazio], ...(lista || []).map(c => [String(c.id), c.nome])];
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key) || '';
}
