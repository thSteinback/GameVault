const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamevault'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

/* ---------- CADASTRO (usuário comum) ---------- */
app.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body;

  db.query(
    'SELECT 1 FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?',
    [nome, email],
    async (err, rows) => {
      if (err)  return res.status(500).json({ success: false, message: 'Falha de conexão com o servidor!' });
      if (rows.length) return res.json({ success: false, message: 'Nome ou e-mail já existe' });

      try {
        const senhaHash = await bcrypt.hash(senha, 10); // <-- hash aqui

        db.query(
          `INSERT INTO usuarios (USU_NOME, USU_EMAIL, USU_SENHA) VALUES (?, ?, ?)`,
          [nome, email, senhaHash],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, message: 'Erro ao cadastrar' });
            res.json({ success: true, message: 'Usuário cadastrado com sucesso' });
          }
        );
      } catch (e) {
        res.status(500).json({ success: false, message: 'Erro ao processar senha' });
      }
    }
  );
});


// LOGIN simples (texto puro): aceita usuário OU administrador
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha)
    return res.status(400).json({ success: false, message: 'Preencha todos os campos' });

  const verificar = async (registro, isAdmin) => {
    if (!registro) return res.json({ success: false, message: 'Credenciais Inválidas' });

    const senhaOk = await bcrypt.compare(senha, registro.senhaDB); // <-- compare aqui
    if (!senhaOk) return res.json({ success: false, message: 'Credenciais Inválidas' });

    return res.json({ success: true, isAdmin });
  };

  db.query(
    'SELECT USU_SENHA AS senhaDB FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?',
    [nome, nome],
    (err, rUser) => {
      if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });
      if (rUser.length) return verificar(rUser[0], false);

      db.query(
        'SELECT ADM_SENHA AS senhaDB FROM administradores WHERE ADM_NOME = ? OR ADM_EMAIL = ?',
        [nome, nome],
        (err2, rAdm) => {
          if (err2) return res.status(500).json({ success: false, message: 'Erro no servidor' });
          verificar(rAdm[0], true);
        }
      );
    }
  );
});


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const nomeArquivo = Date.now() + path.extname(file.originalname);
    cb(null, nomeArquivo);
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

// Upload do avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  const nomeUsuario = req.body.nomeUsuario;
  const caminhoAvatar = req.file.filename;

  db.query(
    'UPDATE usuarios SET USU_AVATAR = ? WHERE USU_NOME = ?',
    [caminhoAvatar, nomeUsuario],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar avatar:', err);
        return res.status(500).json({ success: false, message: 'Erro ao atualizar avatar' });
      }
      res.json({ success: true, avatarPath: `/uploads/${caminhoAvatar}` });
    }
  );
});

// Buscar avatar do usuário
app.get('/usuario-avatar', (req, res) => {
  const nomeUsuario = req.query.nome;
  db.query(
    'SELECT USU_AVATAR FROM usuarios WHERE USU_NOME = ?',
    [nomeUsuario],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false });
      }
      const caminho = results[0].USU_AVATAR
        ? `/uploads/${results[0].USU_AVATAR}`
        : 'imagens/oMimico.png';
      res.json({ success: true, avatar: caminho });
    }
  );
});

// Upload do banner/fundo
app.post('/upload-banner', upload.single('banner'), (req, res) => {
  const nomeUsuario = req.body.nomeUsuario;
  const caminhoBanner = req.file.filename;

  db.query(
    'UPDATE usuarios SET USU_BANNER = ? WHERE USU_NOME = ?',
    [caminhoBanner, nomeUsuario],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar banner:', err);
        return res.status(500).json({ success: false, message: 'Erro ao atualizar banner' });
      }
      res.json({ success: true, bannerPath: `/uploads/${caminhoBanner}` });
    }
  );
});

// Buscar banner/fundo do usuário
app.get('/usuario-banner', (req, res) => {
  const nomeUsuario = req.query.nome;
  db.query(
    'SELECT USU_BANNER FROM usuarios WHERE USU_NOME = ?',
    [nomeUsuario],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false });
      }
      const caminho = results[0].USU_BANNER
        ? `/uploads/${results[0].USU_BANNER}`
        : '';
      res.json({ success: true, banner: caminho });
    }
  );
});

// Buscar info completa (nome, data de criação) do usuário
app.get('/usuario-info', (req, res) => {
  const nomeUsuario = req.query.nome;
  db.query(
    'SELECT USU_NOME, USU_DATA_CRIACAO FROM usuarios WHERE USU_NOME = ?',
    [nomeUsuario],
    (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false });
      }
      const info = results[0];
      res.json({
        success: true,
        nome: info.USU_NOME,
        membroDesde: info.USU_DATA_CRIACAO // Formatação será feita no front
      });
    }
  );
});

/* ─────────────────────────────────────────
   ROTAS ADMIN
   ───────────────────────────────────────── */

// Listar todos os jogos (admin)
app.get('/admin/jogos', (req, res) => {
  db.query(
    'SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_ATIVO = 1',
    (err, rows) => {
      if (err) return res.status(500).json({ erro: 'Falha ao listar jogos' });
      res.json(rows);
    }
  );
});

// Cadastrar jogo (admin)
app.post('/admin/jogos', upload.single('imagem'), (req, res) => {
  const { nome, desc } = req.body;
  const img = req.file ? req.file.filename : null;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });

  db.query(
    'INSERT INTO jogos (JOG_NOME, JOG_DESC, JOG_IMG, JOG_ATIVO) VALUES (?,?,?,1)',
    [nome, desc || null, img],
    (err) => {
      if (err) return res.status(500).json({ erro: 'Falha ao cadastrar jogo' });
      res.status(201).json({ msg: 'Jogo inserido com sucesso' });
    }
  );
});

// Excluir jogo (admin)
app.delete('/admin/jogos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT JOG_IMG FROM jogos WHERE JOG_COD = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Falha ao buscar jogo' });
    if (rows.length && rows[0].JOG_IMG) {
      const caminho = path.resolve(__dirname, 'uploads', rows[0].JOG_IMG);
      fs.unlink(caminho, () => {});
    }
    db.query('DELETE FROM jogos WHERE JOG_COD = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ erro: 'Falha ao excluir jogo' });
      res.json({ msg: 'Jogo removido' });
    });
  });
});

// Listar usuários (admin)
app.get('/admin/usuarios', (req, res) => {
  db.query(
    `SELECT USU_COD AS id, USU_NOME AS nome, USU_EMAIL AS email,
            USU_AVATAR AS avatar, USU_DATA_CRIACAO AS dataCriacao,
            0 AS isAdmin
     FROM usuarios
     UNION ALL
     SELECT ADM_COD AS id, ADM_NOME AS nome, ADM_EMAIL AS email,
            NULL AS avatar, ADM_DATA_CRIACAO AS dataCriacao,
            1 AS isAdmin
     FROM administradores
     ORDER BY dataCriacao DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ erro: 'Falha ao listar usuários' });
      res.json(rows);
    }
  );
});

// Excluir usuário (admin)
app.delete('/admin/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE USU_COD = ?', [id], (err) => {
    if (err) return res.status(500).json({ erro: 'Falha ao excluir usuário' });
    res.json({ msg: 'Usuário removido' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
