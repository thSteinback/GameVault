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
// Palavrões clássicos e variações fonéticas/comuns
  'merda', 'bosta', 'cocô', 'coco', 'porra', 'prra', 'prra', 'caralho', 'carai', 'carailho',
  'cacete', 'cacetada', 'puta', 'puta que pariu', 'putaquepariu', 'puta merda',
  'puto', 'putinha', 'foda', 'foda-se', 'fodase', 'foder', 'fodido', 'fodida',
  'desgraca', 'desgracado', 'desgraçada', 'desgaca', 'praga',
  'arrombado', 'arrombada', 'arrombadinho', 'arrombadinha',
  'otario', 'otaria', 'otário', 'otária', 'otariozinho',
  'idiota', 'idiotice', 'imbecil', 'imbecilidade', 'burro', 'burra', 'burrice',
  'estupido', 'estupida', 'retardado', 'retardada', 'retardadinho',
  'babaca', 'babacão', 'babacao', 'corno', 'cornudo', 'cagão', 'cagao', 'cagar',
  'vagabundo', 'vagabunda', 'vadio', 'vadia', 'piranha', 'cuzao', 'cuzao', 'cuzona',
  'cu', 'bunda', 'rabo', 'viado', 'bicha', 'bichona', 'bichinha',
  'lixo', 'escroto', 'escrota', 'nojento', 'nojenta', 'nojeira',
  'palhaco', 'palhaço', 'trouxa', ' trouxa ', 'bobo', 'boba',
  'fdp', 'filho da puta', 'filha da puta', 'filhodaputa', 'fdp', 'f dps',
  'vsf', 'vá se fuder', 'vai se fuder', 'vaise fuder', 'pqp', 'puta que pariu',
  'tnc', 'torcendo o nariz', 'krl', 'krlh', 'caraleo', 'carai',
  'noob', 'nub', 'n00b', 'lixo de jogo',

// Insultos à inteligência/caráter (genéricos mas agressivos)
  'anta', 'animal', 'asno', 'jumento', 'besta', 'bestalho', 'tapado', 'tapada',
  'mongol', 'mongoloide', 'down', 'retroso',
  'inutil', 'inútil', 'fracassado', 'fracassada', 'perdedor', 'perdedora',
  'patetico', 'patetica', 'patético', 'patética', 'ridiculo', 'ridicula',
  'doente', 'maluco', 'maluca', 'louco', 'louca', 'doido', 'doida', 'doidinho',
  'mal amado', 'mal amada', 'recalcado', 'recalcada', 'frustrado', 'frustrada',
  'zé ruela', 'ze ruela', 'zerala', 'zé nessuno', 'ze ninguem', 'zé ninguém',
  'pau no cu', 'paunocu', 'pau no seu cu', 'chupa meu pau', 'chupa pau',
  'bocó', 'boco', 'bocó', 'mané', 'mane', 'manezinho', 'joao ninguém',
  'vtnc', 'vai tomar no cu', 'vai toma no cu', 'vtnct', 'tomar no cu', 'tnc',
  'desgraçado', 'desgraçada', 'lazarento', 'lazarenta', 'leproso',
  'corninho', 'corno manso', 'pirralho', 'pirralha', 'moleque', 'mirenha',
  'miseravel', 'miserável', 'infeliz', 'safado', 'safada', 'canalha',
  'covarde', 'bandido', 'ladrão', 'ladra', 'traira', 'traidor',
  'verme', 'escoria', 'escória', 'fezes', 'esterco', 'porcaria',
  'idiota util', 'boneco', 'marionete', 'gado', 'boi', 'ovelha',

// Termos regionais/ofensivos específicos do BR
  'paraiba', 'cearense', 'baiano', 'mineiro', 'paulista', 'carioca', // Apenas se usados como xingamento genérico em certos contextos, mas riscoso. Mantendo focado em xingamentos diretos.
// Melhor focar em:
  'nortista', 'sulista', 'nordestino', // Adicionar apenas se o contexto for claro, mas muitas vezes é geopolítico.
// Vamos focar em insultos diretos:
  'caba', 'mofino', 'jagunço', 'capeta', 'diabo', 'capetinha',
  'mulherengo', 'putaria', 'sacana', 'sacanagem', 'sem vergonha', 'semvergonha',
  'vagaroso', 'lesma', 'barata', 'ratazana', 'rato', 'traça',
  'quenga', 'bitola', 'cabeça dura', 'teimoso', 'teimosa'
];

/* Discurso de ódio, preconceito estrutural, ameaças de morte, crimes sexuais e extremismo.
Zero tolerância. */
const GRAVES = [
// --- RACISMO E PRECONCEITO RACIAL ---
  'macaco', 'macaca', 'mono', 'primata', 'gorila', 'chipanzé', 'orangotango',
  'preto fedido', 'preta fedida', 'negro fedido', 'negra fedida',
  'macaco de sho', 'macaco do shopee', // Variações modernas
  'volta pra senzala', 'volta para senzala', 'volta pro cativeiro',
  'crioulo', 'nego imundo', 'negro imundo', 'preto imundo',
  'escravo', 'escravocrata', 'raça inferior', 'raca inferior', 'genetica inferior',
  'cabelo duro', 'cabelo pixaim', 'pixaim', 'denegrir', 'inveja de branco',
  'branquelo', 'ario', 'supremacia branca', 'power white',
  'indio burro', 'indio preguiçoso', 'india', 'bugre',
  'japones de olho puxado', 'chino', 'puxadinho',
  'arabe terrorist', 'muculmano', 'islamita',

// --- ANTISSEMITISMO E NAZISMO ---
  'judeu de merda', 'judeu imundo', 'judeu ratazana', 'judeu sionista',
  'sionista de merda', 'jews', 'kike',
  'nazista', 'nazismo', 'hitler', 'terceiro reich',
  'hitler tinha razao', 'hitler tinha razão', 'heil hitler', 'salve hitler',
  'sieg heil', '88', '14 palavras', 'blood and soil',
  'holocausto nunca existiu', 'holocausto mentira', 'holocaito',
  'camara de gas', 'camara de gás', 'zyklon b',

// --- HOMOFOBIA, BIFOBIA E TRANSFOBIA ---
  'viadinho', 'viadaço', 'viado de merda', 'viado imundo',
  'traveco', 'travesti de merda', 'travesti imunda',
  'sapatao', 'sapatonas', 'sapatilha', 'lesbica de merda',
  'aberração', 'aberracao', 'aberração da natureza', 'contra a natureza',
  'cura gay', 'tratamento gay', 'destransicionar', 'ideologia de genero',
  'bicha nojenta', 'bicha asquerosa', 'efeminado', 'maricas', 'viadagem',
  'pride parade', 'orgulho gay', // Contexto pode variar, mas frequentemente atacado por extremistas
  'homossexualismo', // Termo pejorativo antigo
  'gayzinho', 'bichinha', 'boiola', 'baitola', 'entendido',
  'transexual', 'transgenero', // Usados como insulto em certos contextos, mas a lista é de termos de ódio.
// Melhor usar frases de ódio:
  'homossexual deve morrer', 'gay deve ser exterminado',
  'mulher homem', 'homem mulher', 'nao e homem', 'nao e mulher',

// --- XENOFOBIA E PRECONCEITO REGIONAL (BR E MUNDO) ---
  'volta pro seu pais', 'volta para seu pais', 'volta pra africa', 'volta pra asia',
  'estrangeiro de merda', 'imigrante de merda', 'refugiado de merda',
  'invasor', 'parasita social', 'ratos', 'barata',
  'nordestino macaco', 'nordestino preguicoso', 'paraiba lerd', 'cearense jumento',
  'baiano trouxa', 'mineiro falso', 'paulista explorador', 'carioca ladrão',
  'argentino merda', 'boliviano macaco', 'venezolano lixo',
  'haitiano', 'senegalês', 'sindrome de vira-lata',

// --- CAPACITISMO (DEFICIÊNCIA) ---
  'retardado mental', 'retardada mental', 'deficiente inutil', 'deficiente inútil',
  'aleijado', 'aleijada', 'mutilado', 'monstro', 'aberração fisica',
  'down', 'mongol', 'mongoloide', 'especial', 'crianca especial',
  'cego', 'ceguinho', 'surdo', 'mudo', 'mudinho', 'paralitico', 'paralítico',
  'cadeirante', 'tetraplegico', 'quadruplegico', 'leproso', 'hanseníase',
  'autista', 'asperger', 'esquizofrenico', 'bipolar', 'usando doença como insulto',

// --- MISOGINIA E PRECONCEITO DE GÊNERO ---
  'mulher tem que apanhar', 'mulher tem que ser batida', 'lugar de mulher',
  'mulher nao presta', 'mulher só serve', 'mulher objeto',
  'feminazi', 'feminista de merda', 'feminista imunda', 'feminismo cancer',
  'bruxa', 'bruxa velha', 'fea', 'feia', 'gorda', 'baleia', 'vaca',
  'cadela', 'cadela cio', 'puta', 'vagabunda', 'facil', 'galinha',
  'mulher barraqueira', 'mulher histérica', 'tpm', 'menstruada',
  'feminicídio', 'estupro corretivo',
  'direitos das mulheres sao mentira', 'salario menor mulher',

// --- VIOLÊNCIA, AMEAÇAS DE MORTE E AUTOLESÃO ---
  'va se matar', 'vai se matar', 'se mata', 'mate-se', 'suicida',
  'te mato', 'vou te matar', 'vou matar voce', 'vou matar você',
  'vou acabar com voce', 'vou acabar com você', 'vou te destruir',
  'merece morrer', 'merece a morte', 'tomara que morra', 'espero que morra',
  'quero que morra', 'morra', 'morrer', 'mata essa gente', 'extermínio',
  'vou quebrar sua cara', 'vou te bater', 'vou te espancar',
  'enforcar', 'enforcado', 'se enforca', 'pula da ponte', 'pula do predio',
  'toma veneno', 'bebe ratonicida', 'corta os pulsos', 'lanca na frente do onibus',
  'bico de papel', 'ponte do saber', // Codinomes de locais de suicídio
  'massacre', 'chacina', 'atirador de elite', 'school shooter',
  'columbine', 'realengo', 'suzano', // Nomes de massacres usados como troféu

// --- CRIMES SEXUAIS E ABUSO ---
  'estupro', 'estuprar', 'estuprador', 'estuprada',
  'pedofilo', 'pedofilia', 'pederasta', 'abuso infantil',
  'abusar de crianca', 'tocar em menor', 'menor de idade',
  'cesta básica', // Gíria para abuso em alguns contextos criminosos
  'nudez infantil', 'csam', 'lolicon', 'shotacon',
  'estupro de vulneravel', 'boa noite cinderela',
  'assédio', 'assedio sexual', 'importunação',

// --- TERRORISMO, EXTREMISMO E ÓDIO RELIGIOSO ---
  'estado islamico', 'isis', 'daesh', 'al qaida', 'taliba',
  'kkk', 'ku klux klan', 'klan', 'cavaleiros do kuh klux klan',
  'neonazista', 'skinhead', 'cabeça raspada', 'farda verde',
  'jihad', 'guerra santa', 'matar infiel', 'cruzada',
  'crente idiota', 'evangelico burro', 'católico imundo', 'ateu de merda',
  'macumbeiro', 'satânico', 'adorador do diabo', 'pai de santo charlatão',
  'destruir igreja', 'quebrar terreiro', 'limpeza religiosa',
  'antifa', 'antifasista', // Frequentemente alvo de violência de grupos opostos
  'comunista de merda', 'esquerdista imundo', 'petralha', 'coxinha', // Polarização extrema que incita violência

// --- OUTROS TERMOS DE ÓDIO ESPECÍFICOS ---
  'gordo', 'gorda', 'baleia', 'foca', 'elefante', // Gordofobia
  'pobre', 'preso', 'bandido', 'marginal', 'lixo humano', // Claseísmo
  'favelado', 'comunidade', 'beco', // Preconceito de classe/localização
  'doente mental', 'louco varrido', 'manicomio'
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
