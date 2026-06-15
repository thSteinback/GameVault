const pool = require('../config/db');

// Totais gerais do sistema
exports.totais = async () => {
  const [r] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM jogos WHERE JOG_ATIVO = 1) AS jogos,
      (SELECT COUNT(*) FROM usuarios)                  AS usuarios,
      (SELECT COUNT(*) FROM comentarios)               AS comentarios,
      (SELECT COUNT(*) FROM avaliacoes)                AS avaliacoes,
      (SELECT COUNT(*) FROM favoritos)                 AS favoritos`);
  return r[0];
};

// Usuários com mais avaliações
exports.topAvaliadores = (lim = 5) => pool.query(
  `SELECT u.USU_NOME AS nome, COUNT(a.AVL_COD) AS total
     FROM usuarios u JOIN avaliacoes a ON a.USU_COD = u.USU_COD
    GROUP BY u.USU_COD ORDER BY total DESC, u.USU_NOME ASC
    LIMIT ` + (Number(lim) || 5));

// Usuários com mais comentários
exports.topComentaristas = (lim = 5) => pool.query(
  `SELECT u.USU_NOME AS nome, COUNT(c.COM_COD) AS total
     FROM usuarios u JOIN comentarios c ON c.USU_COD = u.USU_COD
    GROUP BY u.USU_COD ORDER BY total DESC, u.USU_NOME ASC
    LIMIT ` + (Number(lim) || 5));

// Jogos mais favoritados ("curtidos")
exports.jogosMaisFavoritados = (lim = 5) => pool.query(
  `SELECT j.JOG_NOME AS nome, COUNT(f.USU_COD) AS total
     FROM jogos j JOIN favoritos f ON f.JOG_COD = j.JOG_COD
    WHERE j.JOG_ATIVO = 1
    GROUP BY j.JOG_COD ORDER BY total DESC, j.JOG_NOME ASC
    LIMIT ` + (Number(lim) || 5));

// Jogos melhor avaliados (por média, com pelo menos 1 avaliação)
exports.jogosMelhorAvaliados = (lim = 5) => pool.query(
  `SELECT j.JOG_NOME AS nome, ROUND(AVG(a.AVL_NOTA), 2) AS media, COUNT(a.AVL_COD) AS total
     FROM jogos j JOIN avaliacoes a ON a.JOG_COD = j.JOG_COD
    WHERE j.JOG_ATIVO = 1
    GROUP BY j.JOG_COD HAVING total > 0 ORDER BY media DESC, total DESC
    LIMIT ` + (Number(lim) || 5));

// Distribuição das notas (1 a 5)
exports.distribuicaoNotas = () => pool.query(
  `SELECT AVL_NOTA AS nota, COUNT(*) AS total
     FROM avaliacoes GROUP BY AVL_NOTA ORDER BY AVL_NOTA`);
