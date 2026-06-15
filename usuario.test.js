/* Testes de integração da API (Mocha + Supertest + Chai).
   O banco é MOCKADO (sobrescrevendo as funções dos models), então
   estes testes rodam SEM precisar de um MySQL ativo. */

process.env.JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-teste';

const request = require('supertest');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuarioModel');
const Jogo = require('../models/jogoModel');
const app = require('../server');

describe('API GameVault', function () {
  this.timeout(5000);

  describe('POST /cadastrar', () => {
    it('rejeita senha fraca (validação no servidor)', async () => {
      const res = await request(app).post('/cadastrar')
        .send({ nome: 'Joao', email: 'joao@email.com', senha: '123' });
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.match(/senha/i);
    });

    it('cadastra um novo usuário com sucesso', async () => {
      Usuario.existeNomeOuEmail = async () => [[]];          // não existe
      Usuario.criar = async () => [{ insertId: 99 }];
      Usuario.criarPermissoes = async () => [{}];
      const res = await request(app).post('/cadastrar')
        .send({ nome: 'NovoUser', email: 'novo@email.com', senha: 'Senha123' });
      expect(res.body).to.have.property('success', true);
      expect(res.body.message).to.match(/cadastrado/i);
    });

    it('não permite nome/e-mail já cadastrado', async () => {
      Usuario.existeNomeOuEmail = async () => [[{ '1': 1 }]];  // já existe
      const res = await request(app).post('/cadastrar')
        .send({ nome: 'Repetido', email: 'rep@email.com', senha: 'Senha123' });
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.match(/já existe/i);
    });
  });

  describe('POST /login', () => {
    it('exige usuário e senha', async () => {
      const res = await request(app).post('/login').send({ nome: 'so-nome' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
    });

    it('rejeita credenciais inválidas', async () => {
      Usuario.credenciaisPorLogin = async () => [[]];        // usuário inexistente
      const res = await request(app).post('/login')
        .send({ nome: 'fantasma', senha: 'qualquer' });
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.match(/inválid/i);
    });

    it('faz login e devolve um token quando a senha confere', async () => {
      const hash = bcrypt.hashSync('Senha123', 10);
      Usuario.credenciaisPorLogin = async () => [[{ USU_COD: 1, senhaDB: hash, USU_TIPO: 'usuario' }]];
      const res = await request(app).post('/login')
        .send({ nome: 'real', senha: 'Senha123' });
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('isAdmin', false);
      expect(res.body).to.have.property('token').that.is.a('string');
    });
  });

  describe('GET /jogos (catálogo público)', () => {
    it('devolve a lista de jogos', async () => {
      Jogo.listarAtivos = async () => [[{ JOG_COD: 1, JOG_NOME: 'Jogo X', JOG_IMG: null, media: 4.5, totalAval: 2 }]];
      const res = await request(app).get('/jogos');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0]).to.have.property('JOG_NOME', 'Jogo X');
    });
  });

  describe('Proteção das rotas /admin/*', () => {
    it('bloqueia /admin/jogos sem token (401)', async () => {
      const res = await request(app).get('/admin/jogos');
      expect(res.status).to.equal(401);
    });

    it('permite /admin/jogos com token de admin (200)', async () => {
      Jogo.listarAdmin = async () => [[{ JOG_COD: 1, JOG_NOME: 'Jogo Admin' }]];
      const token = jwt.sign({ id: 1, nome: 'admin', admin: true }, process.env.JWT_SECRET);
      const res = await request(app).get('/admin/jogos')
        .set('Authorization', 'Bearer ' + token);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });
});
