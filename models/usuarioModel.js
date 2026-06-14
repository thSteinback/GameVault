const pool = require('../config/db');

/* ---------- Usuários ---------- */
exports.existeNomeOuEmail = (nome, email) =>
  pool.execute('SELECT 1 FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?', [nome, email]);

exports.criar = (nome, email, senhaHash) =>
  pool.execute('INSERT INTO usuarios (USU_NOME, USU_EMAIL, USU_SENHA) VALUES (?,?,?)', [nome, email, senhaHash]);

exports.credenciaisPorLogin = (login) =>
  pool.execute('SELECT USU_COD, USU_SENHA AS senhaDB, USU_TIPO FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?', [login, login]);

exports.codPorNome = (nome) =>
  pool.execute('SELECT USU_COD FROM usuarios WHERE USU_NOME = ? OR USU_EMAIL = ?', [nome, nome]);

exports.setAvatar = (avatar, nome) =>
  pool.execute('UPDATE usuarios SET USU_AVATAR = ? WHERE USU_NOME = ?', [avatar, nome]);

exports.getAvatar = (nome) =>
  pool.execute('SELECT USU_AVATAR FROM usuarios WHERE USU_NOME = ?', [nome]);

exports.setBanner = (banner, nome) =>
  pool.execute('UPDATE usuarios SET USU_BANNER = ? WHERE USU_NOME = ?', [banner, nome]);

exports.getBanner = (nome) =>
  pool.execute('SELECT USU_BANNER FROM usuarios WHERE USU_NOME = ?', [nome]);

exports.getInfo = (nome) =>
  pool.execute('SELECT USU_NOME, USU_DATA_CRIACAO FROM usuarios WHERE USU_NOME = ?', [nome]);

exports.verificarAdmin = (login) =>
  pool.execute('SELECT 1 FROM usuarios WHERE (USU_NOME = ? OR USU_EMAIL = ?) AND USU_TIPO = "admin"', [login, login]);

exports.listarTodosComAdmins = () =>
  pool.query(
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
            1 AS isAdmin, 0 AS banido, 0 AS strikes
       FROM administradores
     ORDER BY dataCriacao DESC`
  );

exports.excluir = (id) =>
  pool.execute('DELETE FROM usuarios WHERE USU_COD = ?', [id]);

/* ---------- Permissões / banimento ---------- */
exports.criarPermissoes = (usuCod) =>
  pool.execute(
    'INSERT IGNORE INTO permissoesusuarios (USU_COD, PERM_BANIDO, PERM_STRIKES, PERM_COMENTAR) VALUES (?,0,0,1)',
    [usuCod]
  );

exports.getPermissoes = (usuCod) =>
  pool.execute('SELECT PERM_BANIDO, PERM_COMENTAR, PERM_STRIKES FROM permissoesusuarios WHERE USU_COD = ?', [usuCod]);

exports.somarStrikes = (usuCod, qtd) =>
  pool.execute(
    `INSERT INTO permissoesusuarios (USU_COD, PERM_BANIDO, PERM_STRIKES, PERM_COMENTAR)
     VALUES (?, 0, ?, 1)
     ON DUPLICATE KEY UPDATE PERM_STRIKES = PERM_STRIKES + VALUES(PERM_STRIKES)`,
    [usuCod, qtd]
  );

exports.banir = (usuCod) =>
  pool.execute('UPDATE permissoesusuarios SET PERM_BANIDO = 1, PERM_COMENTAR = 0 WHERE USU_COD = ?', [usuCod]);

exports.desbanir = (usuCod) =>
  pool.execute('UPDATE permissoesusuarios SET PERM_BANIDO = 0, PERM_STRIKES = 0, PERM_COMENTAR = 1 WHERE USU_COD = ?', [usuCod]);

exports.registrarLog = (usuCod, acao) =>
  pool.execute('INSERT INTO logsacoes (USU_COD, LOG_ACAO) VALUES (?, ?)', [usuCod, acao]);
