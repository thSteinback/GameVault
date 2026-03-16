const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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
    (err, rows) => {
      if (err)  return res.status(500).json({ success:false, message:'Erro no servidor' });
      if (rows.length) return res.json({ success:false, message:'Nome ou e-mail já existe' });

      db.query(
        `INSERT INTO usuarios
         (USU_NOME, USU_EMAIL, USU_SENHA, USU_DATA_CRIACAO)
         VALUES (?,?,?,CURRENT_DATE)`,
        [nome, email, senha],
        err2 => {
          if (err2) return res.status(500).json({ success:false, message:'Erro ao cadastrar' });
          res.json({ success:true, message:'Usuário cadastrado com sucesso' });
        }
      );
    }
  );
});


// LOGIN simples (texto puro): aceita usuário OU administrador
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha)
    return res.status(400).json({ success:false, message:'Preencha todos os campos' });

  /* função para finalizar a resposta */
  const finalizar = (registro) => {
    if (!registro || registro.senhaDB !== senha)
      return res.json({ success:false, message:'Credenciais Inválidas' });

    return res.json({ success:true, isAdmin: registro.tipo === 'ADMIN' });
  };

  // 1) tenta na tabela USUARIOS
  db.query(
    'SELECT USU_SENHA AS senhaDB, "USER" AS tipo \
       FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?',
    [nome, nome],
    (err, rUser) => {
      if (err) return res.status(500).json({ success:false, message:'Erro no servidor' });
      if (rUser.length) return finalizar(rUser[0]);

      // 2) tenta na tabela ADMINISTRADORES
      db.query(
        'SELECT ADM_SENHA AS senhaDB, "ADMIN" AS tipo \
           FROM administradores WHERE ADM_NOME = ? OR ADM_EMAIL = ?',
        [nome, nome],
        (err2, rAdm) => {
          if (err2) return res.status(500).json({ success:false, message:'Erro no servidor' });
          finalizar(rAdm[0]);   // se não achar → registro = undefined ⇒ credenciais inválidas
        });
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
