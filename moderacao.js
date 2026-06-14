/* ============================================================
   moderacao.js — Agente moderador por regras (lista de palavras)
   ------------------------------------------------------------
   Avaliação 100% local, sem dependência externa.
   Usado pela rota POST /admin/moderar (varredura em lote).

   Como ajustar:
   - Edite as listas LEVES e GRAVES abaixo.
   - LIMITE_STRIKES define após quantos comentários tóxicos
     o usuário é banido automaticamente.
   ============================================================ */

// Após acumular este número de comentários tóxicos, o usuário é banido.
const LIMITE_STRIKES = 3;

/* Palavras/termos ofensivos comuns (palavrões, ofensas).
   Tudo em minúsculo e SEM acento — a normalização cuida do resto. */
const LEVES = [
  'merda', 'bosta', 'porra', 'caralho', 'cacete', 'puta', 'puta que pariu',
  'puto', 'foda', 'foda-se', 'foder', 'fodido', 'desgraca', 'desgracado',
  'arrombado', 'otario', 'idiota', 'imbecil', 'burro', 'estupido', 'retardado',
  'babaca', 'corno', 'vagabundo', 'vagabunda', 'piranha', 'cuzao', 'cu',
  'viado', 'bicha', 'lixo', 'escroto', 'nojento', 'palhaco', 'trouxa',
  'fdp', 'vsf', 'pqp', 'tnc', 'krl', 'caralho', 'morto', 'morra', 'noob',
];

/* Termos graves: discurso de ódio, ameaças, slurs.
   Continuam valendo 1 strike (política de strikes acumulados),
   mas são marcados como "grave" no relatório do admin. */
const GRAVES = [
  'macaco', 'macaca', 'preto fedido', 'volta pra senzala',
  'judeu de merda', 'nazista', 'hitler tinha razao',
  'va se matar', 'se mata', 'mate-se', 'te mato', 'vou te matar',
  'estupro', 'estuprar', 'pedofilo', 'estuprador',
  'viadinho', 'sapatao', 'traveco',
];

/* ---------- Normalização (anti-evasão) ---------- */
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    // leetspeak comum
    .replace(/[4@]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    // colapsa repetições exageradas: "merdaaaaa" -> "merdaa"
    .replace(/(.)\1{2,}/g, '$1$1')
    .trim();
}

/* Versão "espaçada" para pegar evasão tipo "m e r d a" ou "m.e.r.d.a" */
function compactar(textoNormalizado) {
  return textoNormalizado.replace(/[^a-z0-9]/g, '');
}

/* Monta um regex de palavra inteira a partir de um termo */
function regexTermo(termo) {
  const t = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escapa
  // \b não funciona bem com espaços nos termos compostos, então
  // tratamos termos com espaço como substring e termos simples como palavra inteira.
  if (/\s/.test(termo)) return new RegExp(t, 'i');
  return new RegExp(`\\b${t}\\b`, 'i');
}

/* ---------- Análise principal ----------
   Retorna: { toxico, grave, termos: [..] } */
function analisar(texto) {
  const norm = normalizar(texto);
  const compact = compactar(norm);
  const achados = [];
  let grave = false;

  const verificar = (lista, ehGrave) => {
    for (const termo of lista) {
      const termoNorm = normalizar(termo);
      const bateTexto = regexTermo(termoNorm).test(norm);
      const bateCompacto = compactar(termoNorm).length >= 4 &&
                           compact.includes(compactar(termoNorm));
      if (bateTexto || bateCompacto) {
        achados.push(termo);
        if (ehGrave) grave = true;
      }
    }
  };

  verificar(LEVES, false);
  verificar(GRAVES, true);

  const termos = [...new Set(achados)];
  return { toxico: termos.length > 0, grave, termos };
}

module.exports = { analisar, LIMITE_STRIKES, LEVES, GRAVES };
