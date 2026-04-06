# 🎮 GameVault

[![status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com/thSteinback/GameVault)
[![node.js](https://img.shields.io/badge/node.js-18+-green)](https://nodejs.org/)
[![mysql](https://img.shields.io/badge/mysql-database-blue)](https://www.mysql.com/)
[![license](https://img.shields.io/badge/license-academic-lightgrey)](https://github.com/thSteinback/GameVault)

---

## 📌 Domínio do Problema

O mercado de jogos digitais cresce exponencialmente a cada ano, mas ainda falta uma plataforma centralizada onde jogadores possam **avaliar, comentar e descobrir novos títulos** com base na opinião da própria comunidade, e não apenas de críticos especializados.

O projeto **GameVault** propõe a implementação de uma plataforma web completa que centraliza informações sobre jogos digitais, permitindo que usuários:

- Avaliem jogos com notas de 1 a 5 estrelas
- Comentem e interajam com outros jogadores
- Adicionem títulos à sua lista de favoritos
- Descubram novos jogos com base na curadoria da comunidade

A aplicação conta com um **backend em Node.js + Express** consumido por um **frontend dinâmico em EJS, HTML, CSS e JavaScript**, com persistência de dados em banco relacional **MySQL**.

---

## 🎯 Objetivo

Desenvolver uma aplicação web completa utilizando:

- **Node.js + Express** — backend RESTful
- **MySQL** — banco de dados relacional
- **EJS + HTML + CSS + JS** — frontend dinâmico

Aplicando boas práticas de arquitetura, organização de código e integração entre camadas.

---

## 🚀 Funcionalidades

### 🔐 Usuários
- Cadastro e login
- Edição de perfil
- Exclusão de conta

### 🎮 Jogos
- Listagem de jogos
- Página de detalhes (capa, descrição, avaliação média)
- CRUD de jogos (administrador)

### ⭐ Avaliações
- Avaliação por estrelas (1 a 5)
- Cálculo automático de média

### 💬 Comentários
- Comentários por jogo
- Listagem dinâmica

### ❤️ Favoritos
- Adicionar e remover favoritos
- Listagem personalizada por usuário

---

## ✅ Requisitos Funcionais (RF)

### 🔐 1. Usuários e Acesso

**RF01 –** O sistema deve permitir o cadastro de novo usuário com nome, e-mail e senha.

**RF02 –** O sistema deve permitir autenticação via login com e-mail e senha.

**RF03 –** O sistema deve permitir logout, encerrando a sessão do usuário.

**RF04 –** O sistema deve permitir a edição dos dados cadastrais do perfil do usuário.

**RF05 –** O sistema deve permitir a exclusão da conta do usuário.

---

### 🎮 2. Jogos

**RF06 –** O sistema deve permitir a listagem de todos os jogos cadastrados.

**RF07 –** O sistema deve exibir a página de detalhes de um jogo (capa, descrição, gênero, avaliação média).

**RF08 –** O sistema deve permitir o cadastro de novos jogos (restrito a administradores).

**RF09 –** O sistema deve permitir a edição de jogos existentes (restrito a administradores).

**RF10 –** O sistema deve permitir a exclusão de jogos (restrito a administradores).

---

### ⭐ 3. Avaliações

**RF11 –** O sistema deve permitir que usuários autenticados avaliem um jogo com nota de 1 a 5 estrelas.

**RF12 –** O sistema deve calcular e exibir automaticamente a média de avaliações de cada jogo.

**RF13 –** O sistema deve permitir que o usuário edite ou remova sua avaliação.

**RF14 –** O sistema deve impedir que um mesmo usuário avalie o mesmo jogo mais de uma vez.

---

### 💬 4. Comentários

**RF15 –** O sistema deve permitir que usuários autenticados comentem em jogos.

**RF16 –** O sistema deve listar dinamicamente todos os comentários de um jogo.

**RF17 –** O sistema deve permitir que o usuário exclua seus próprios comentários.

---

### ❤️ 5. Favoritos

**RF18 –** O sistema deve permitir que o usuário adicione jogos à sua lista de favoritos.

**RF19 –** O sistema deve permitir que o usuário remova jogos dos favoritos.

**RF20 –** O sistema deve exibir a listagem personalizada de favoritos por usuário.

---

## 📑 Requisitos Não Funcionais (RNF)

### 🏗 1. Arquitetura e Plataforma

**RNF01 –** O sistema deve ser uma aplicação web responsiva, acessível via navegador.

**RNF02 –** Deve funcionar corretamente nos principais navegadores modernos (Chrome, Edge, Firefox, Safari).

**RNF03 –** A arquitetura deve seguir o padrão MVC (Model-View-Controller), separando claramente as responsabilidades de cada camada.

---

### ⚡ 2. Desempenho

**RNF04 –** O tempo de resposta para operações comuns (listagem, detalhes, avaliação) não deve ultrapassar 2 segundos.

**RNF05 –** As consultas ao banco de dados devem ser otimizadas com uso de índices nas colunas mais consultadas.

---

### 🔒 3. Segurança

**RNF06 –** As senhas dos usuários devem ser armazenadas de forma criptografada utilizando hash seguro (bcrypt).

**RNF07 –** O sistema deve implementar controle de sessão com expiração automática.

**RNF08 –** O sistema deve garantir que um usuário só possa editar ou excluir seus próprios dados.

**RNF09 –** O sistema deve possuir proteção básica contra ataques comuns (SQL Injection, XSS).

**RNF10 –** Rotas administrativas devem ser protegidas e acessíveis apenas a usuários com perfil de administrador.

---

### 🗄 4. Banco de Dados

**RNF11 –** O sistema deve utilizar banco de dados relacional MySQL com integridade referencial garantida por chaves estrangeiras.

**RNF12 –** O esquema do banco deve ser versionado e documentado.

---

### 🎨 5. Usabilidade

**RNF13 –** A interface deve ser intuitiva, com navegação clara e feedback visual para ações do usuário.

**RNF14 –** O sistema deve seguir princípios básicos de UX/UI, garantindo boa experiência em diferentes resoluções de tela.

---

### 🔄 6. Manutenibilidade

**RNF15 –** O código deve seguir o padrão MVC com separação clara entre rotas, controllers e models.

**RNF16 –** O projeto deve possuir documentação técnica (este README).

**RNF17 –** O sistema deve possuir testes manuais documentados via Postman ou Insomnia para validação das rotas.

---

## 🛠️ Tecnologias

| Tecnologia | Função | Justificativa |
|---|---|---|
| **Node.js** | Runtime do backend | Leve, assíncrono e amplamente adotado no mercado para aplicações web |
| **Express** | Framework HTTP | Minimalista e flexível, facilita a criação de rotas e middlewares de forma organizada |
| **MySQL** | Banco de dados relacional | Robusto, confiável e com excelente integração com Node.js via drivers nativos |
| **EJS** | Template engine (frontend) | Permite renderização dinâmica de HTML no servidor, integrando dados do backend diretamente nas views |
| **HTML / CSS / JS** | Interface do usuário | Base da web, garantindo compatibilidade universal com qualquer navegador moderno |
| **bcrypt** | Criptografia de senhas | Padrão de mercado para hash seguro, protegendo as credenciais dos usuários |
| **express-session** | Gerenciamento de sessão | Controla o estado de autenticação do usuário entre as requisições HTTP |

---

## 🏗️ Arquitetura (Modelo C4)

### 🔹 Nível 1 – Contexto
O usuário acessa o sistema via navegador. O **GameVault** processa as requisições via backend e persiste os dados no **banco de dados MySQL**.

```
[Usuário] → [Navegador] → [GameVault (Node.js + Express)] → [MySQL]
```

### 🔹 Nível 2 – Contêineres

| Contêiner | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | EJS, HTML, CSS, JS | Renderização da interface e interação com o usuário |
| Backend | Node.js + Express | Processamento das regras de negócio e exposição das rotas |
| Database | MySQL | Persistência e integridade dos dados |

### 🔹 Nível 3 – Componentes

**Backend:**
- `Routes` — Mapeamento de URLs para os controllers correspondentes
- `Controllers` — Lógica de negócio e tratamento das requisições
- `Models` — Comunicação direta com o banco de dados

**Frontend:**
- `Views (EJS)` — Templates HTML dinâmicos renderizados pelo servidor
- `Scripts JS` — Interações no lado do cliente
- `CSS` — Estilização e responsividade

### 🔹 Nível 4 – Código (Exemplo)

```javascript
router.get('/jogo/:id', async (req, res) => {
  const jogo = await buscarJogo(req.params.id);
  const avaliacoes = await buscarAvaliacoes(req.params.id);
  res.render('detalhes', { jogo, avaliacoes });
});
```

**Diagrama C4:**

![Diagrama C4](http://www.plantuml.com/plantuml/png/jLNDRjj64BxhAQQ-L0RqWpGvvHH7LXq7igoQSjAUX15t96-mtALdbxBZ8e_GXp1wA5eWfw1Fm1ShXwH84NQFEOaxkplVDzzyEthZ0tB84jFxGTlOP8hW9eJKlnwF6Uz6MnrkidNcYMDd0zamYbqoJWrQkJFqGHcz7azU3HSIkhwOZHFqWRW8hIR53TIMU9H-f_n9wgpSAVFtVeG2SQEt6MF-L_ulUJWZHkrxivFVBg-Ngu_dotUhsVHiEZ_j7_U23eRWLEEMCK6Ol88XHDe7AXPdcD07p4oGfCFX4ERv7n-cCtZn6YQNy-Nqr-MbX7iBOkzi7rMYxG2EJkHN-y2e71yLWMkVvO-i7J3vWghF7tTa87KCMsAoiKO61p66_D6uhGD5yAduzK0GTqi1vS1Nx4P7nxteitpsjvZGJdYkV1ae81lgWh-lHr43c90D9T1QhursWM9iOMypWfGuqO70yHQjVa0-9CCGygyXCyuBYzuLcNtnpr6f8O5Wfts6fiXM0GctTylb8f8a7OL_gXG-EPzFhoBPg4jTlNMPLSYV-_6BJfN7y7iF0A0nM_-ErYjCK-b7QdGi0lxfu2EjAzIBsG0cKJI0zxZ3A6QTbbATsq2ymPW00-Ck_zk3ma8GDE003niBMexYLcH9eDEMBX5CzPx8uXmYuXsLhfWxHQDFVW3J-vJ9bseisEtoVm31vD-skkg9fMt-BTOE2CYgr1Mu7b9a10GyAAqe-0duwRglCE0QFHNPtwADowQVeghKZtwPGNyjuP6_DSSIEk447yWYQBjndDJ6QymnWAnsypFs5Fml7J-qNRZsUDXlETDijXBzZ0_0T9jfhsjWgLGkleykv-F3sysbWmfdXNW4v6Ec7O6ICe6Ikj8dBdifBhjONCwdnMEEeAzSgnoqpJek3TZij1uK1kjwqMrlQyTwDlNPPO5ySUgg_11ATTz18fKbJcbJ801wO1Um51rZybvwds1A6gl6Eo_A1tR647l0b5tA6bNr7hl0YLRAq1roYNxHh3eKsh14bum10JCPn7jx3M27HglQQmG5f31h1qcdQqzfj7o5ngHTbRtjli4aDIHvyNyVWkFRZ7mGAM1ZilkIWNfUWCgZecxja_h_uGbmEwbGvANxgbBq43EfSaUN4rWUJ1VnYpYhC2KMz6obYOTobbXNNfddNsNcl-pwlZ75rEuqFcFyskhxSzrUBj1xXDHnVQgpszLxQcDCjBt1mwoT8urAaJCwrW7tpiEgokQE7EkykUaznLcG8KciITvRSVODMPKbvZy0)

---

## 📁 Estrutura de Pastas

```
GameVault/
│
├── public/                   # Arquivos estáticos servidos diretamente ao navegador
│   ├── css/                  # Folhas de estilo (global, componentes, responsividade)
│   ├── js/                   # Scripts do lado do cliente (interações, validações)
│   └── imagens/              # Capas de jogos, ícones e demais assets visuais
│
├── views/                    # Templates EJS renderizados pelo servidor
│   ├── index.ejs             # Página inicial — listagem de jogos em destaque
│   ├── detalhes.ejs          # Página de detalhes de um jogo (avaliações, comentários)
│   ├── perfil.ejs            # Página de perfil do usuário e favoritos
│   ├── login.ejs             # Formulário de autenticação
│   ├── cadastro.ejs          # Formulário de cadastro de usuário
│   └── admin/                # Views exclusivas para administradores
│       └── jogos.ejs         # CRUD de jogos (cadastro, edição, exclusão)
│
├── routes/                   # Definição das rotas da aplicação
│   ├── jogos.js              # Rotas relacionadas a jogos (/jogos, /jogos/:id, etc.)
│   ├── usuarios.js           # Rotas de autenticação e perfil (/login, /cadastro, etc.)
│   ├── avaliacoes.js         # Rotas de avaliação (/avaliar, /editar-avaliacao, etc.)
│   ├── comentarios.js        # Rotas de comentários (/comentar, /excluir-comentario, etc.)
│   └── favoritos.js          # Rotas de favoritos (/favoritar, /desfavoritar, etc.)
│
├── controllers/              # Lógica de negócio — processam as requisições e retornam respostas
│   ├── jogosController.js    # Lógica de listagem, detalhes e CRUD de jogos
│   ├── usuariosController.js # Lógica de cadastro, login, logout e edição de perfil
│   ├── avaliacoesController.js # Lógica de avaliação e cálculo de médias
│   ├── comentariosController.js # Lógica de criação e exclusão de comentários
│   └── favoritosController.js   # Lógica de adição e remoção de favoritos
│
├── models/                   # Camada de acesso ao banco de dados
│   ├── db.js                 # Configuração e conexão com o MySQL
│   ├── Jogo.js               # Queries relacionadas à entidade Jogo
│   ├── Usuario.js            # Queries relacionadas à entidade Usuário
│   ├── Avaliacao.js          # Queries relacionadas à entidade Avaliação
│   ├── Comentario.js         # Queries relacionadas à entidade Comentário
│   └── Favorito.js           # Queries relacionadas à entidade Favorito
│
├── middlewares/              # Funções intermediárias executadas entre a requisição e o controller
│   ├── auth.js               # Verificação de autenticação (protege rotas privadas)
│   └── admin.js              # Verificação de perfil administrador
│
├── app.js                    # Ponto de entrada da aplicação — configuração do Express
└── package.json              # Dependências e scripts do projeto
```

### 📌 O que cada camada faz?

#### 🔵 Routes (`/routes`)
Responsáveis por mapear as URLs da aplicação para os controllers corretos. Cada arquivo de rota agrupa os endpoints de um domínio específico (jogos, usuários, avaliações, etc.), mantendo o `app.js` limpo e organizado.

---

#### 🟢 Controllers (`/controllers`)
Contêm a **lógica de negócio** da aplicação. Recebem a requisição vinda das rotas, processam as regras necessárias (validações, cálculos, controle de acesso) e retornam a resposta adequada — seja renderizando uma view ou devolvendo dados.

---

#### 🟡 Models (`/models`)
São a camada mais próxima do banco de dados. Executam as **queries SQL** e retornam os dados para os controllers. Centralizar o acesso ao banco nos models facilita a manutenção e evita duplicação de código.

---

#### 🟣 Views (`/views`)
Templates **EJS** que misturam HTML com dados dinâmicos injetados pelo servidor. São renderizados e enviados prontos ao navegador, sem necessidade de chamadas adicionais de API no frontend.

---

#### 🌐 Public (`/public`)
Arquivos **estáticos** (CSS, JS do cliente, imagens) servidos diretamente pelo Express sem passar pelos controllers. Tudo que o navegador consome diretamente fica aqui.

---

#### 🛡️ Middlewares (`/middlewares`)
Funções executadas **antes** dos controllers em rotas protegidas. Verificam autenticação (`auth.js`) ou permissão de administrador (`admin.js`), interrompendo a requisição caso o usuário não esteja autorizado.

---

## 👥 Organização da Equipe

### 👨‍💻 Backend
- Configuração do servidor e rotas
- Conexão e modelagem do banco de dados
- Regras de negócio e autenticação

### 🎨 Frontend
- Estruturação das views EJS
- Estilização e responsividade
- Interações via JavaScript no cliente

### 🤝 Ambos
- Testes e validação das funcionalidades
- Integração entre frontend e backend
- Documentação do projeto

---

## 🔧 Melhorias Futuras

- [ ] Autenticação via JWT (substituindo session)
- [ ] Sistema de recomendação de jogos baseado em avaliações
- [ ] Upload de imagens de capa via formulário
- [ ] Dashboard administrativo com métricas
- [ ] Paginação na listagem de jogos
- [ ] Filtros por gênero, plataforma e nota

---

## 📎 Como Executar

**Pré-requisitos:** Node.js 18+, MySQL

```bash
# Clone o repositório
git clone https://github.com/thSteinback/GameVault.git
cd GameVault

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz com:
# DB_HOST=localhost
# DB_USER=seu_usuario
# DB_PASS=sua_senha
# DB_NAME=gamevault
# SESSION_SECRET=sua_chave_secreta

# Execute as migrations do banco (se disponível)
# mysql -u root -p < database/schema.sql

# Inicie o servidor
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📌 Status do Projeto

🚧 **Em desenvolvimento**

---

## 📄 Licença

Projeto acadêmico — uso educacional.

---

*Desenvolvido por **Thomas Henry Steinback***
