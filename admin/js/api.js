// admin/js/api.js
// Wrapper de fetch para rotas protegidas /admin/*:
// - anexa o token JWT no header Authorization
// - se a sessão expirou (401) ou faltou permissão (403), volta ao login
function adminFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = Object.assign({}, options.headers,
    token ? { Authorization: 'Bearer ' + token } : {});
  return fetch(url, Object.assign({}, options, { headers })).then(resp => {
    if (resp.status === 401 || resp.status === 403) {
      alert('Sessão expirada ou acesso negado. Faça login novamente.');
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('usuarioLogado');
      window.location.href = '../index.html';
      throw new Error('Não autorizado');
    }
    return resp;
  });
}
