// admin/js/guard.js
(async function () {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  const isAdmin = localStorage.getItem('isAdmin');

  if (!usuarioLogado || isAdmin !== 'true') {
    alert('Acesso negado!');
    window.location.href = '../index.html';
    return;
  }

  try {
    const resp = await fetch(`http://localhost:3000/verificar-admin?nome=${usuarioLogado}`);
    const data = await resp.json();
    if (!data.isAdmin) {
      alert('Acesso negado!');
      window.location.href = '../index.html';
    }
  } catch {
    window.location.href = '../index.html';
  }
})();