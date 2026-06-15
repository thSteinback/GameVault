/* ── Toast (Passo 7): substitui os alert() de feedback ── */
function toast(msg, tipo) {
  let c = document.getElementById('gv-toasts');
  if (!c) {
    c = document.createElement('div');
    c.id = 'gv-toasts';
    c.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(c);
  }
  const cor = tipo === 'erro' ? '#5a1f1f' : (tipo === 'ok' ? '#1f5a2f' : '#2a2a35');
  const brd = tipo === 'erro' ? '#ff9b9b' : (tipo === 'ok' ? '#9bffb0' : '#8C8CFF');
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `background:${cor};color:#fff;border-left:4px solid ${brd};padding:12px 16px;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.35);font-size:14px;max-width:320px;opacity:0;transform:translateX(20px);transition:.25s;`;
  c.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'none'; });
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; setTimeout(() => t.remove(), 250); }, 3200);
}

// BLOQUEIO DE ACESSO SE NÃO ESTIVER LOGADO NA PÁGINA DE PERFIL
document.addEventListener("DOMContentLoaded", function () {
  // Só bloqueia caso esteja na página de perfil
  if (window.location.pathname.includes('perfilp.html')) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
      alert("Você precisa estar logado para acessar o perfil!");
      window.location.href = "index.html";
      return;
    }
  }
});

// Modal login/cadastro (mantido igual ao seu original)
document.addEventListener("DOMContentLoaded", function () {
  const loginModal = document.getElementById("loginModal");
  const cadastroModal = document.getElementById("cadastroModal");

  const abrirLogin = document.getElementById("abrirLogin");
  const abrirCadastro = document.getElementById("abrirCadastro");

  const fecharBtns = document.querySelectorAll(".close");

  const trocarParaCadastro = document.getElementById("trocarParaCadastro");
  const trocarParaLogin = document.getElementById("trocarParaLogin");

  if (abrirLogin) {
    abrirLogin.addEventListener("click", () => {
      loginModal.style.display = "block";
      cadastroModal.style.display = "none";
    });
  }

  if (abrirCadastro) {
    abrirCadastro.addEventListener("click", () => {
      cadastroModal.style.display = "block";
      loginModal.style.display = "none";
    });
  }

  fecharBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loginModal.style.display = "none";
      cadastroModal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
    if (e.target === cadastroModal) cadastroModal.style.display = "none";
  });

  if (trocarParaCadastro) {
    trocarParaCadastro.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "none";
      cadastroModal.style.display = "block";
    });
  }

  if (trocarParaLogin) {
    trocarParaLogin.addEventListener("click", (e) => {
      e.preventDefault();
      cadastroModal.style.display = "none";
      loginModal.style.display = "block";
    });
  }

  // Controle do usuário logado (exibe nome e botão de sair)
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const nav = document.querySelector("nav");

  if (usuarioLogado && nav) {
    if (abrirLogin) abrirLogin.style.display = "none";
    if (abrirCadastro) abrirCadastro.style.display = "none";
    // Adiciona saudação
    const spanUser = document.createElement("span");
    spanUser.textContent = `Bem-vindo, ${usuarioLogado}`;
    spanUser.style.marginRight = "12px";
    spanUser.style.color = "#fff";
    nav.insertBefore(spanUser, nav.firstChild);
    console.log("Usuário logado:", usuarioLogado);
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      const btnAdmin = document.createElement("a");
      btnAdmin.textContent = "Painel Admin";
      btnAdmin.href = "admin/dashboard.html";
      btnAdmin.style.cssText = "margin-right:12px;color:#FFD700;font-weight:bold;";
      nav.appendChild(btnAdmin);
    }
    // Botão de sair
    const btnSair = document.createElement("button");
    btnSair.textContent = "Sair";
    btnSair.style.background = "#fff";
    btnSair.onclick = () => {
      localStorage.removeItem("usuarioLogado");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");
      location.reload();
    };
    nav.appendChild(btnSair);
  }
});

function exibirErro(input, mensagem, spanErro) {
  input.classList.add("erro-input");
  spanErro.textContent = mensagem;
}

function limparErro(input, spanErro) {
  input.classList.remove("erro-input");
  spanErro.textContent = "";
}

// Login
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("loginUsuario");
    const senha = document.getElementById("loginSenha");
    const erroUsuario = document.getElementById("erroLoginUsuario");
    const erroSenha = document.getElementById("erroLoginSenha");

    let erro = false;

    if (!usuario.value.trim()) {
      exibirErro(usuario, "Usuário obrigatório", erroUsuario);
      erro = true;
    } else limparErro(usuario, erroUsuario);

    if (!senha.value.trim()) {
      exibirErro(senha, "Senha obrigatória", erroSenha);
      erro = true;
    } else limparErro(senha, erroSenha);

    if (erro) return;

    try {
      const resp = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: usuario.value,
          senha: senha.value
        })
      });

      const data = await resp.json();
      if (data.success) {
        localStorage.setItem("usuarioLogado", usuario.value);
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
        if (data.token) localStorage.setItem("token", data.token);
        document.getElementById("loginModal").style.display = "none";
        if (data.isAdmin) {
          window.location.href = "admin/dashboard.html";
        } else {
          location.reload();
        }
      } else {
        exibirErro(usuario, "Credenciais Inválidas", erroUsuario);
        exibirErro(senha, "Credenciais Inválidas", erroSenha);
      }
    } catch (err) {
      toast("Erro de conexão com o servidor!", "erro");
    }
  });
}

// Cadastro
const btnCadastro = document.getElementById("btnCadastro");
if (btnCadastro) {
  btnCadastro.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("cadastroEmail");
    const usuario = document.getElementById("cadastroUsuario");
    const senha = document.getElementById("cadastroSenha");
    const confirmarSenha = document.getElementById("cadastroConfirmarSenha");

    const erroEmail = document.getElementById("erroCadastroEmail");
    const erroUsuario = document.getElementById("erroCadastroUsuario");
    const erroSenha = document.getElementById("erroCadastroSenha");
    const erroConfirmar = document.getElementById("erroCadastroConfirmarSenha");

    let erro = false;
    if (!email.value.trim()) {
      exibirErro(email, "E-mail obrigatório", erroEmail);
      erro = true;
    } else if (!validarEmail(email.value)) {
      exibirErro(email, "E-mail inválido", erroEmail);
      erro = true;
    } else limparErro(email, erroEmail);

    if (!usuario.value.trim()) {
      exibirErro(usuario, "Usuário obrigatório", erroUsuario);
      erro = true;
    } else limparErro(usuario, erroUsuario);

    if (!senha.value.trim()) {
      exibirErro(senha, "Senha obrigatória", erroSenha);
      erro = true;
    } else if (!validarSenha(senha.value)) {
      exibirErro(senha, "Mín. 8 caracteres, 1 maiúscula e 1 número", erroSenha);
      erro = true;
    } else limparErro(senha, erroSenha);

    if (!confirmarSenha.value.trim()) {
      exibirErro(confirmarSenha, "Confirmação obrigatória", erroConfirmar);
      erro = true;
    } else if (confirmarSenha.value !== senha.value) {
      exibirErro(confirmarSenha, "Senhas não coincidem", erroConfirmar);
      erro = true;
    } else limparErro(confirmarSenha, erroConfirmar);

    if (erro) return;

    try {
      const resp = await fetch("http://localhost:3000/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: usuario.value,
          email: email.value,
          senha: senha.value
        })
      });

      const data = await resp.json();
      if (data.success) {
        toast("Cadastro realizado com sucesso!", "ok");
        document.getElementById("cadastroModal").style.display = "none";
        email.value = "";
        usuario.value = "";
        senha.value = "";
        confirmarSenha.value = "";
      } else {
        const msg = data.message || "Erro ao cadastrar.";
        if (/e-mail/i.test(msg)) exibirErro(email, msg, erroEmail);
        else if (/senha/i.test(msg)) exibirErro(senha, msg, erroSenha);
        else if (/nome|usu/i.test(msg)) exibirErro(usuario, msg, erroUsuario);
        else toast(msg, "erro");
      }
    } catch (err) {
      toast("Erro de conexão com o servidor!", "erro");
    }
  });
}

//banner (slides do topo)
window.onload = function () {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      dots[i].classList.toggle("active", i === index);
    });
    currentSlide = index;
  }

  window.goToSlide = function(index) {
    showSlide(index);
  }

  setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }, 5500);
};

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validarSenha(senha) {
  return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha);
}

// --------- CARROSSEL INFINITO E CENTRALIZADO ---------
(function () {
  const carrossel = document.getElementById("carrossel");
  if (!carrossel) return;
  const items = Array.from(carrossel.getElementsByClassName("carrossel-item"));
  const total = items.length;
  let centerIndex = 2;

  function updateCarousel() {
    items.forEach(item => {
      item.classList.remove("center", "near", "far");
    });

    for (let i = 0; i < total; i++) {
      const item = items[i];
      if (i === centerIndex) {
        item.classList.add("center");
      } else if (i === (centerIndex - 1 + total) % total || i === (centerIndex + 1) % total) {
        item.classList.add("near");
      } else {
        item.classList.add("far");
      }
    }
    carrossel.style.transform = `translateX(calc(50% - ${(centerIndex + 0.5) * 120}px - ${(centerIndex) * 20}px))`;
  }

  function moveCarrossel(dir) {
    centerIndex = (centerIndex + dir + total) % total;
    updateCarousel();
  }

  document.getElementById("navLeft").onclick = () => moveCarrossel(-1);
  document.getElementById("navRight").onclick = () => moveCarrossel(1);

  items.forEach((item, idx) => {
    item.onclick = () => {
      if (idx === (centerIndex - 1 + total) % total) moveCarrossel(-1);
      else if (idx === (centerIndex + 1) % total) moveCarrossel(1);
    };
  });

  updateCarousel();
})();

// Redirecionamento perfil
document.addEventListener("DOMContentLoaded", function () {
  const btnPerfil = document.getElementById("btnPerfil");
  if (btnPerfil) {
    btnPerfil.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "perfilp.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const logo = document.getElementById("logoGameVault");
  if (logo) {
    logo.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }
});

/* ------------------- PERFIL DINÂMICO ---------------------- */

// Carregar dados dinâmicos do perfil
window.addEventListener('DOMContentLoaded', async () => {
  // Só executa caso esteja na página de perfil
  if (!window.location.pathname.includes('perfilp.html')) return;

  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (!usuarioLogado) return;

  // Avatar
  const respostaAvatar = await fetch(`http://localhost:3000/usuario-avatar?nome=${usuarioLogado}`);
  const resultadoAvatar = await respostaAvatar.json();
  if (resultadoAvatar.success && resultadoAvatar.avatar) {
    document.querySelector('.avatar').src = resultadoAvatar.avatar;
  }

  // Banner/fundo (USU_BANNER)
  const respostaBanner = await fetch(`http://localhost:3000/usuario-banner?nome=${usuarioLogado}`);
  const resultadoBanner = await respostaBanner.json();
  if (resultadoBanner.success && resultadoBanner.banner) {
    document.querySelector('.perfil-banner').style.backgroundImage = `url('${resultadoBanner.banner}')`;
    document.querySelector('.perfil-banner').style.backgroundSize = "cover";
    document.querySelector('.perfil-banner').style.backgroundPosition = "center";
  } else {
    document.querySelector('.perfil-banner').style.backgroundImage = '';
  }

  // Nome e membro desde (USU_DATA_CRIACAO)
  const respostaInfo = await fetch(`http://localhost:3000/usuario-info?nome=${usuarioLogado}`);
  const resultadoInfo = await respostaInfo.json();
  if (resultadoInfo.success) {
    document.querySelector('.username').textContent = resultadoInfo.nome;
    if (resultadoInfo.membroDesde) {
      const data = new Date(resultadoInfo.membroDesde);
      const ano = data.getFullYear();
      document.querySelector('.membro').textContent = `Membro desde ${ano}`;
    } else {
      document.querySelector('.membro').textContent = "";
    }
  }
});

// Envio de avatar
const formAvatar = document.getElementById('form-avatar');
if (formAvatar) {
  formAvatar.addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
      toast('Usuário não autenticado', 'erro');
      return;
    }

    const formData = new FormData();
    const arquivo = document.getElementById('avatar').files[0];
    formData.append('avatar', arquivo);
    formData.append('nomeUsuario', usuarioLogado);

    const resposta = await fetch('http://localhost:3000/upload-avatar', {
      method: 'POST',
      body: formData
    });

    const resultado = await resposta.json();
    if (resultado.success) {
      document.querySelector('.avatar').src = resultado.avatarPath;
      toast('Avatar alterado com sucesso!', 'ok');
    } else {
      toast('Erro ao atualizar avatar.', 'erro');
    }
  });
}

// Envio do fundo/banner
const formBanner = document.getElementById('form-banner');
if (formBanner) {
  formBanner.addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
      toast('Usuário não autenticado', 'erro');
      return;
    }

    const formData = new FormData();
    const arquivo = document.getElementById('banner').files[0];
    formData.append('banner', arquivo);
    formData.append('nomeUsuario', usuarioLogado);

    const resposta = await fetch('http://localhost:3000/upload-banner', {
      method: 'POST',
      body: formData
    });

    const resultado = await resposta.json();
    if (resultado.success) {
      document.querySelector('.perfil-banner').style.backgroundImage = `url('${resultado.bannerPath}')`;
      document.querySelector('.perfil-banner').style.backgroundSize = "cover";
      document.querySelector('.perfil-banner').style.backgroundPosition = "center";
      toast('Fundo alterado com sucesso!', 'ok');
    } else {
      toast('Erro ao atualizar fundo.', 'erro');
    }
  });

  // Submete automaticamente quando escolhe o arquivo
  document.getElementById('banner').addEventListener('change', function () {
    formBanner.querySelector('button[type="submit"]').click();
  });
}
