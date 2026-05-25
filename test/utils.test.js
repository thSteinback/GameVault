const { validarEmail, validarSenha } = require('../public/js/utils');

describe('Funções de Validação (Front-end)', () => {
  test('validarEmail aceita e-mails válidos', () => {
    expect(validarEmail('teste@email.com')).toBe(true);
    expect(validarEmail('usuario.123@dominio.org')).toBe(true);
  });

  test('validarEmail rejeita e-mails inválidos', () => {
    expect(validarEmail('email_invalido')).toBe(false);
    expect(validarEmail('outro@email')).toBe(false);
  });

  test('validarSenha aceita senha forte', () => {
    expect(validarSenha('Senha123')).toBe(true);
    expect(validarSenha('A1b2c3d4')).toBe(true);
  });

  test('validarSenha rejeita senha fraca', () => {
    expect(validarSenha('senha')).toBe(false);
    expect(validarSenha('12345678')).toBe(false);
    expect(validarSenha('abcdefgh')).toBe(false);
    expect(validarSenha('ABCDEFGH')).toBe(false);
  });
});
