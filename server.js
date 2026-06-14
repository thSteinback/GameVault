require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moderacao = require('./moderacao');
const auth = require('./middlewares/auth');
const isAdmin = require('./middlewares/isAdmin');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'gamevault'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

// Interface baseada em Promise (async/await) reutilizando a mesma conexão.
const dbp = db.promise();

/* ---------- CADASTRO (usuário comum) ---------- */
app.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação no servidor (não confia só no front)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  const senhaOk = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha || '');
  if (!nome || !nome.trim())
    return res.json({ success: false, message: 'Nome de usuário obrigatório' });
  if (!emailOk)
    return res.json({ success: false, message: 'E-mail inválido' });
  if (!senhaOk)
    return res.json({ success: false, message: 'Senha fraca: mín. 8 caracteres, 1 maiúscula e 1 número' });

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
          (err2, result) => {
            if (err2) return res.status(500).json({ success: false, message: 'Erro ao cadastrar' });
            // Cria a linha de permissões do usuário (banido=0, strikes=0, pode comentar)
            db.query(
              'INSERT IGNORE INTO permissoesusuarios (USU_COD, PERM_BANIDO, PERM_STRIKES, PERM_COMENTAR) VALUES (?,0,0,1)',
              [result.insertId],
              () => {}
            );
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

  db.query(
    'SELECT USU_COD, USU_SENHA AS senhaDB, USU_TIPO FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?',
    [nome, nome],
    async (err, rUser) => {
      if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });

      if (rUser.length) {
        const senhaOk = await bcrypt.compare(senha, rUser[0].senhaDB);
        if (!senhaOk) return res.json({ success: false, message: 'Credenciais Inválidas' });

        // Mantém a detecção de admin atual (coluna USU_TIPO)
        const ehAdmin = rUser[0].USU_TIPO === 'admin';

        // Emite um token assinado, usado para proteger as rotas /admin/*
        const token = jwt.sign(
          { id: rUser[0].USU_COD, nome, admin: ehAdmin },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );

        return res.json({ success: true, isAdmin: ehAdmin, token });
      }

      return res.json({ success: false, message: 'Credenciais Inválidas' });
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

// Protege TODAS as rotas /admin/* (definidas a partir daqui):
// exige token JWT válido (auth) e privilégio de administrador (isAdmin).
app.use('/admin', auth, isAdmin);

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
    `SELECT u.USU_COD AS id, u.USU_NOME AS nome, u.USU_EMAIL AS email,
            u.USU_AVATAR AS avatar, u.USU_DATA_CRIACAO AS dataCriacao,
            0 AS isAdmin,
            COALESCE(p.PERM_BANIDO, 0)  AS banido,
            COALESCE(p.PERM_STRIKES, 0) AS strikes
     FROM usuarios u
     LEFT JOIN permissoesusuarios p ON p.USU_COD = u.USU_COD
     UNION ALL
     SELECT ADM_COD AS id, ADM_NOME AS nome, ADM_EMAIL AS email,
            NULL AS avatar, ADM_DATA_CRIACAO AS dataCriacao,
            1 AS isAdmin,
            0 AS banido,
            0 AS strikes
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

app.get('/verificar-admin', (req, res) => {
  const nome = req.query.nome;
  db.query(
    'SELECT 1 FROM usuarios WHERE (USU_NOME = ? OR USU_EMAIL = ?) AND USU_TIPO = "admin"',
    [nome, nome],
    (err, rows) => {
      if (err) return res.status(500).json({ isAdmin: false });
      res.json({ isAdmin: rows.length > 0 });
    }
  );
});

/* ─────────────────────────────────────────
   ROTAS PÚBLICAS DE JOGOS (catálogo do usuário)
   ───────────────────────────────────────── */

// Listar todos os jogos ativos (visível para qualquer usuário)
app.get('/jogos', (req, res) => {
  db.query(
    'SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_ATIVO = 1 ORDER BY JOG_DATA_CADASTRO DESC',
    (err, rows) => {
      if (err) return res.status(500).json({ erro: 'Falha ao listar jogos' });
      res.json(rows);
    }
  );
});

// Detalhe de um jogo específico
app.get('/jogos/:id', (req, res) => {
  db.query(
    'SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_COD = ? AND JOG_ATIVO = 1',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: 'Falha ao buscar jogo' });
      if (!rows.length) return res.status(404).json({ erro: 'Jogo não encontrado' });
      res.json(rows[0]);
    }
  );
});

/* ─────────────────────────────────────────
   COMENTÁRIOS
   ───────────────────────────────────────── */

// resolve o USU_COD a partir do nome (ou email) de usuário
async function acharUsuarioPorNome(nome) {
  const [rows] = await dbp.execute(
    'SELECT USU_COD FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?',
    [nome, nome]
  );
  return rows.length ? rows[0].USU_COD : null;
}

// Listar comentários de um jogo
app.get('/jogos/:id/comentarios', async (req, res) => {
  try {
    const [rows] = await dbp.execute(
      `SELECT c.COM_COD, c.COM_TEXTO, c.COM_DATA, u.USU_NOME, u.USU_AVATAR
         FROM comentarios c
         JOIN usuarios u ON u.USU_COD = c.USU_COD
        WHERE c.JOG_COD = ?
        ORDER BY c.COM_DATA DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao listar comentários' });
  }
});

// Criar comentário (bloqueia usuários banidos)
app.post('/jogos/:id/comentarios', async (req, res) => {
  const { nome, texto } = req.body;
  if (!nome || !texto || !texto.trim())
    return res.status(400).json({ erro: 'Informe o usuário e um texto não vazio' });

  try {
    const usuCod = await acharUsuarioPorNome(nome);
    if (!usuCod) return res.status(401).json({ erro: 'Faça login para comentar' });

    const [[perm]] = await dbp.execute(
      'SELECT PERM_BANIDO, PERM_COMENTAR FROM permissoesusuarios WHERE USU_COD = ?',
      [usuCod]
    );
    if (perm && (perm.PERM_BANIDO === 1 || perm.PERM_COMENTAR === 0))
      return res.status(403).json({ erro: 'Você está impedido de comentar.' });

    await dbp.execute(
      'INSERT INTO comentarios (USU_COD, JOG_COD, COM_TEXTO) VALUES (?,?,?)',
      [usuCod, req.params.id, texto.trim()]
    );
    res.status(201).json({ msg: 'Comentário publicado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao publicar comentário' });
  }
});

// Excluir um comentário específico (admin)
app.delete('/comentarios/:id', async (req, res) => {
  try {
    await dbp.execute('DELETE FROM comentarios WHERE COM_COD = ?', [req.params.id]);
    res.json({ msg: 'Comentário removido' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao remover comentário' });
  }
});

/* ─────────────────────────────────────────
   AGENTE MODERADOR — varredura em lote, sob demanda
   Analisa todos os comentários, remove os tóxicos, acumula
   strikes por autor e bane quem atingir o limite.
   ───────────────────────────────────────── */
app.post('/admin/moderar', async (req, res) => {
  try {
    const [comentarios] = await dbp.execute(
      `SELECT c.COM_COD, c.USU_COD, c.COM_TEXTO, u.USU_NOME
         FROM comentarios c
         JOIN usuarios u ON u.USU_COD = c.USU_COD`
    );

    const aRemover = [];
    const porUsuario = {}; // USU_COD -> { nome, qtd, termos:Set, grave }
    const detalhes = [];

    for (const c of comentarios) {
      const r = moderacao.analisar(c.COM_TEXTO || '');
      if (!r.toxico) continue;

      aRemover.push(c.COM_COD);
      if (!porUsuario[c.USU_COD])
        porUsuario[c.USU_COD] = { nome: c.USU_NOME, qtd: 0, termos: new Set(), grave: false };
      porUsuario[c.USU_COD].qtd++;
      porUsuario[c.USU_COD].grave = porUsuario[c.USU_COD].grave || r.grave;
      r.termos.forEach(t => porUsuario[c.USU_COD].termos.add(t));
      detalhes.push({ usuario: c.USU_NOME, grave: r.grave, termos: r.termos });
    }

    // remove os comentários tóxicos de uma vez
    if (aRemover.length) {
      await dbp.query('DELETE FROM comentarios WHERE COM_COD IN (?)', [aRemover]);
    }

    // aplica strikes e decide banimentos
    const banidos = [];
    for (const usuCod of Object.keys(porUsuario)) {
      const info = porUsuario[usuCod];

      // garante a linha e soma os strikes detectados nesta varredura
      await dbp.execute(
        `INSERT INTO permissoesusuarios (USU_COD, PERM_BANIDO, PERM_STRIKES, PERM_COMENTAR)
         VALUES (?, 0, ?, 1)
         ON DUPLICATE KEY UPDATE PERM_STRIKES = PERM_STRIKES + VALUES(PERM_STRIKES)`,
        [usuCod, info.qtd]
      );

      const [[perm]] = await dbp.execute(
        'SELECT PERM_STRIKES, PERM_BANIDO FROM permissoesusuarios WHERE USU_COD = ?',
        [usuCod]
      );

      if (perm.PERM_STRIKES >= moderacao.LIMITE_STRIKES && perm.PERM_BANIDO !== 1) {
        await dbp.execute(
          'UPDATE permissoesusuarios SET PERM_BANIDO = 1, PERM_COMENTAR = 0 WHERE USU_COD = ?',
          [usuCod]
        );
        await dbp.execute(
          'INSERT INTO logsacoes (USU_COD, LOG_ACAO) VALUES (?, ?)',
          [usuCod, `Banimento automático do moderador (${perm.PERM_STRIKES} strikes)`]
        );
        banidos.push({ usuario: info.nome, strikes: perm.PERM_STRIKES });
      }
    }

    res.json({
      analisados: comentarios.length,
      removidos: aRemover.length,
      usuariosAfetados: Object.keys(porUsuario).length,
      banidos,
      detalhes,
      limiteStrikes: moderacao.LIMITE_STRIKES
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha na moderação' });
  }
});

// Desbanir usuário (zera strikes e libera comentários) — admin
app.post('/admin/usuarios/:id/desbanir', async (req, res) => {
  try {
    await dbp.execute(
      'UPDATE permissoesusuarios SET PERM_BANIDO = 0, PERM_STRIKES = 0, PERM_COMENTAR = 1 WHERE USU_COD = ?',
      [req.params.id]
    );
    await dbp.execute(
      'INSERT INTO logsacoes (USU_COD, LOG_ACAO) VALUES (?, ?)',
      [req.params.id, 'Desbanido manualmente pelo admin']
    );
    res.json({ msg: 'Usuário desbanido' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao desbanir' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
