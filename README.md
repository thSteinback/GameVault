# Desenvolvido por Thomas Henry Steinback

🎮 GameVault
<p align="center"> <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow"> <img src="https://img.shields.io/badge/node.js-18+-green"> <img src="https://img.shields.io/badge/mysql-database-blue"> <img src="https://img.shields.io/badge/license-academic-lightgrey"> </p>

📌 Sobre o Projeto

O GameVault é uma plataforma web de avaliação e recomendação de jogos digitais, permitindo que usuários interajam com títulos através de avaliações, comentários e favoritos.

A proposta do sistema é centralizar informações e opiniões da comunidade, facilitando a descoberta de novos jogos.

🎯 Objetivo
Desenvolver uma aplicação web completa utilizando:

Node.js + Express (backend)
MySQL (banco de dados)
EJS + HTML + CSS + JS (frontend)

Aplicando boas práticas de arquitetura, organização de código e integração entre camadas.

🚀 Funcionalidades

🔐 Usuários
Cadastro e login
Edição de perfil
Exclusão de conta

🎮 Jogos
Listagem de jogos
Página de detalhes (capa, descrição, avaliação)
CRUD de jogos (admin)

⭐ Avaliações
Avaliação por estrelas (1 a 5)
Cálculo de média

💬 Comentários
Comentários por jogo
Listagem dinâmica

❤️ Favoritos
Adicionar/remover favoritos
Listagem personalizada

📑 Requisitos Funcionais
<details> <summary>Ver requisitos</summary>
RF01 – Cadastro de usuário
RF02 – Login
RF03 – Logout
RF04 – Editar usuário
RF05 – Excluir conta
RF06 – Listar jogos
RF07 – Exibir detalhes
RF08 – Cadastrar jogo
RF09 – Editar jogo
RF10 – Excluir jogo
RF11 – Avaliar jogos
RF12 – Calcular média
RF13 – Comentar jogos
RF14 – Listar comentários
RF15 – Favoritar jogos
RF16 – Remover favoritos

</details>
⚙️ Requisitos Não Funcionais
RNF01 – Aplicação web responsiva
RNF02 – Tempo de resposta < 2s
RNF03 – Validação de dados no backend
RNF04 – Segurança básica de autenticação
RNF05 – Compatível com navegadores modernos

🛠️ Tecnologias
Tecnologia	Função
Node.js + Express	Backend
MySQL	Banco de dados
EJS	Renderização dinâmica
HTML/CSS/JS	Interface

🏗️ Arquitetura (Modelo C4)

  🔹 Nível 1 – Contexto
Usuário acessa o sistema via navegador → GameVault → Banco de Dados

🔹 Nível 2 – Contêineres
Frontend → Interface (EJS, HTML, CSS, JS)
Backend → Node.js + Express
Database → MySQL

🔹 Nível 3 – Componentes

Backend:
Routes
Controllers
Models

Frontend:
Views (EJS)
Scripts JS
CSS

🔹 Nível 4 – Código
router.get('/jogo/:id', (req, res) => {
  const jogo = buscarJogo(req.params.id);
  res.render('detalhes', { jogo });
});

Estrutura do Projeto:
GameVault/
│
├── public/
│   ├── css/
│   ├── js/
│   └── imagens/
│
├── views/
│   ├── index.ejs
│   ├── detalhes.ejs
│
├── routes/
│   ├── jogos.js
│   ├── usuarios.js
│
├── models/
│   ├── db.js
│
├── app.js
└── package.json

👥 Organização da Equipe
👨‍💻 Backend
API
Banco de dados
Regras de negócio

🎨 Frontend
Interface
Layout
Responsividade

🤝 Ambos
Testes
Integração
Documentação

🔧 Melhorias Futuras
Autenticação JWT
Sistema de recomendação
Upload de imagens
Dashboard admin

📎 Como Executar
npm install
npm start

Acesse:
http://localhost:3000

📌 Status do Projeto
🚧 Em desenvolvimento

📄 Licença
Projeto acadêmico — uso educacional.

DIAGRAMA C4
www.plantuml.com/plantuml/png/jLNDRjj64BxhAQQ-L0RqWpGvvHH7LXq7igoQSjAUX15t96-mtALdbxBZ8e_GXp1wA5eWfw1Fm1ShXwH84NQFEOaxkplVDzzyEthZ0tB84jFxGTlOP8hW9eJKlnwF6Uz6MnrkidNcYMDd0zamYbqoJWrQkJFqGHcz7azU3HSIkhwOZHFqWRW8hIR53TIMU9H-f_n9wgpSAVFtVeG2SQEt6MF-L_ulUJWZHkrxivFVBg-Ngu_dotUhsVHiEZ_j7_U23eRWLEEMCK6Ol88XHDe7AXPdcD07p4oGfCFX4ERv7n-cCtZn6YQNy-Nqr-MbX7iBOkzi7rMYxG2EJkHN-y2e71yLWMkVvO-i7J3vWghF7tTa87KCMsAoiKO61p66_D6uhGD5yAduzK0GTqi1vS1Nx4P7nxteitpsjvZGJdYkV1ae81lgWh-lHr43c90D9T1QhursWM9iOMypWfGuqO70yHQjVa0-9CCGygyXCyuBYzuLcNtnpr6f8O5Wfts6fiXM0GctTylb8f8a7OL_gXG-EPzFhoBPg4jTlNMPLSYV-_6BJfN7y7iF0A0nM_-ErYjCK-b7QdGi0lxfu2EjAzIBsG0cKJI0zxZ3A6QTbbATsq2ymPW00-Ck_zk3ma8GDE003niBMexYLcH9eDEMBX5CzPx8uXmYuXsLhfWxHQDFVW3J-vJ9bseisEtoVm31vD-skkg9fMt-BTOE2CYgr1Mu7b9a10GyAAqe-0duwRglCE0QFHNPtwADowQVeghKZtwPGNyjuP6_DSSIEk447yWYQBjndDJ6QymnWAnsypFs5Fml7J-qNRZsUDXlETDijXBzZ0_0T9jfhsjWgLGkleykv-F3sysbWmfdXNW4v6Ec7O6ICe6Ikj8dBdifBhjONCwdnMEEeAzSgnoqpJek3TZij1uK1kjwqMrlQyTwDlNPPO5ySUgg_11ATTz18fKbJcbJ801wO1Um51rZybvwds1A6gl6Eo_A1tR647l0b5tA6bNr7hl0YLRAq1roYNxHh3eKsh14bum10JCPn7jx3M27HglQQmG5f31h1qcdQqzfj7o5ngHTbRtjli4aDIHvyNyVWkFRZ7mGAM1ZilkIWNfUWCgZecxja_h_uGbmEwbGvANxgbBq43EfSaUN4rWUJ1VnYpYhC2KMz6obYOTobbXNNfddNsNcl-pwlZ75rEuqFcFyskhxSzrUBj1xXDHnVQgpszLxQcDCjBt1mwoT8urAaJCwrW7tpiEgokQE7EkykUaznLcG8KciITvRSVODMPKbvZy0
