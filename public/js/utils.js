function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validarSenha(senha) {
  return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha);
}

// Só isso para exportar e permitir o teste:
module.exports = { validarEmail, validarSenha };
