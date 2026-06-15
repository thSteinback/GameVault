require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const auth    = require('./middlewares/auth');
const isAdmin = require('./middlewares/isAdmin');

const authRoutes       = require('./routes/authRoutes');
const usuarioRoutes    = require('./routes/usuarioRoutes');
const jogoRoutes       = require('./routes/jogoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const avaliacaoRoutes  = require('./routes/avaliacaoRoutes');
const favoritoRoutes   = require('./routes/favoritoRoutes');
const adminRoutes      = require('./routes/adminRoutes');

const app  = express();
const port = process.env.PORT || 3000;

/* View engine (EJS) — header/footer/modais ficam em views/partials */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Middlewares globais */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));      // serve os .html, css, js, imagens
app.use('/uploads', express.static('uploads'));     // imagens enviadas

/* Páginas renderizadas via EJS (mantêm as mesmas URLs .html) */
const paginas = {
  '/': 'index', '/index.html': 'index',
  '/jogos.html': 'jogos',
  '/descJogo.html': 'descJogo',
  '/favoritos.html': 'favoritos',
  '/perfilp.html': 'perfilp',
  '/perfilo.html': 'perfilo'
};
for (const [url, view] of Object.entries(paginas)) {
  app.get(url, (req, res) => res.render(view));
}

/* Rotas públicas */
app.use('/', authRoutes);          // /cadastrar, /login, /verificar-admin
app.use('/', usuarioRoutes);       // /upload-avatar, /usuario-avatar, /usuario-info, ...
app.use('/', comentarioRoutes);    // /jogos/:id/comentarios, /comentarios/:id
app.use('/', avaliacaoRoutes);     // /jogos/:id/avaliacoes
app.use('/favoritos', favoritoRoutes); // /favoritos, /favoritos/status, /favoritos/toggle
app.use('/jogos', jogoRoutes);     // /jogos, /jogos/:id

/* Rotas administrativas (token + privilégio de admin) */
app.use('/admin', auth, isAdmin, adminRoutes);

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));

module.exports = app;
