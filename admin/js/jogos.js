/********  admin/js/jogos.js  *********/
const API = 'http://localhost:3000';           // backend Node
const headers = { 'Content-Type': 'application/json' };

/* --------- ELEMENTOS DOM --------- */
const formCadastro = document.getElementById('formCadastro');
const tbody        = document.querySelector('#tabelaJogos tbody');

/* --------- LISTAR / BUSCAR --------- */
async function carregarJogos(q = '') {
  const url = q
    ? `${API}/admin/jogos?q=${encodeURIComponent(q)}`
    : `${API}/admin/jogos`;

  const res   = await fetch(url);
  const jogos = await res.json();

  tbody.innerHTML = '';
  jogos.forEach(j => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${j.JOG_COD}</td>
        <td>${j.JOG_NOME}</td>
        <td>
          <button class="del"
                  data-id="${j.JOG_COD}"
                  data-title="${j.JOG_NOME}">
            Excluir
          </button>
        </td>
      </tr>
    `);
  });
}

/* --------- CADASTRAR --------- */
if (formCadastro) {
  formCadastro.addEventListener('submit', async e => {
    e.preventDefault();

    const body = {
      nome: document.getElementById('titulo').value,   // JOG_NOME
      desc: document.getElementById('sinopse').value   // JOG_DESC
    };

    const res = await fetch(`${API}/admin/jogos`, {
      method : 'POST',
      headers,
      body   : JSON.stringify(body)
    });

    if (res.ok) {
      formCadastro.reset();
      carregarJogos();
    } else {
      const msg = await res.json();
      alert(`Falha ao cadastrar: ${msg.message || res.status}`);
    }
  });
}

/* --------- EXCLUIR --------- */
tbody.addEventListener('click', async e => {
  if (!e.target.classList.contains('del')) return;

  const id    = e.target.dataset.id;
  const title = e.target.dataset.title;
  if (!confirm(`Excluir o jogo “${title}” (ID ${id})?`)) return;

  const res = await fetch(`${API}/admin/jogos/${id}`, { method:'DELETE' });
  res.ok ? carregarJogos() : alert('Erro ao excluir');
});

/* --------- BUSCA --------- */
document.getElementById('btnBusca').addEventListener('click', () =>
  carregarJogos(document.getElementById('busca').value.trim()));

document.getElementById('btnLimpar').addEventListener('click', () => {
  document.getElementById('busca').value = '';
  carregarJogos();
});

/* --------- INICIAL --------- */
carregarJogos();
