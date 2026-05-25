const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');

describe('Testes de Usuário - GameVault', function () {
  // Aumenta o timeout para operações com banco se necessário
  this.timeout(5000);

  const usuarioTeste = {
    nome: 'usuarioTeste_' + Date.now(),
    email: 'teste_' + Date.now() + '@email.com',
    senha: 'Senha123'
  };

  it('Deve cadastrar um novo usuário com sucesso', async () => {
    const res = await request(app)
      .post('/cadastro')
      .send(usuarioTeste);

    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message').that.includes('Usuário cadastrado');
  });

  it('Não deve permitir cadastro com nome/email já cadastrado', async () => {
    const res = await request(app)
      .post('/cadastro')
      .send(usuarioTeste);

    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property('message').that.includes('Nome de usuário');
  });

  it('Deve permitir login com usuário e senha corretos', async () => {
    const res = await request(app)
      .post('/login')
      .send({ nome: usuarioTeste.nome, senha: usuarioTeste.senha });

    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message').that.includes('Login realizado');
  });

  it('Não deve permitir login com senha errada', async () => {
    const res = await request(app)
      .post('/login')
      .send({ nome: usuarioTeste.nome, senha: 'SenhaErrada' });

    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property('message').that.includes('Credenciais Inválidas');
  });

  it('Não deve permitir login com usuário inexistente', async () => {
    const res = await request(app)
      .post('/login')
      .send({ nome: 'usuarioQueNaoExiste', senha: 'qualquerSenha' });

    expect(res.body).to.have.property('success', false);
    expect(res.body).to.have.property('message').that.includes('Credenciais Inválidas');
  });
  const fs = require('fs');
const path = require('path');

  it('Deve permitir upload de avatar para usuário existente', async () => {
    const imgPath = path.join(__dirname, '../imagens/oMimico.png');
    // Verifica se a imagem existe
    if (!fs.existsSync(imgPath)) {
      throw new Error('Imagem de teste "oMimico.png" não encontrada na raiz do projeto.');
    }

    const res = await request(app)
      .post('/upload-avatar')
      .field('nomeUsuario', usuarioTeste.nome)
      .attach('avatar', imgPath);

    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('avatarPath').that.is.a('string');
  });
});



