# Desenvolvido por Thomas Henry Steinback

DIAGRAMA C4
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

' Configurações Gerais
LAYOUT_WITH_LEGEND()
title Diagrama C4 - Sistema GameVault

' --- NÍVEL 1: CONTEXTO ---
Person(admin, "Administrador", "Usuário responsável por gerenciar o catálogo de jogos e configurações do sistema.")
System(gamevault_system, "GameVault", "Sistema de gerenciamento de biblioteca de jogos que permite organizar e configurar títulos.")

Rel(admin, gamevault_system, "Gerencia e visualiza jogos", "HTTPS")

' --- NÍVEL 2: CONTAINERS ---
System_Boundary(c1, "GameVault") {
    Container(web_app, "Aplicação Web", "HTML, CSS, JavaScript", "Interface através da qual o administrador interage com o sistema.")
    Container(api_app, "API Server", "Node.js, Express", "Provê a lógica de negócio e endpoints para a aplicação web.")
    ContainerDb(database, "Banco de Dados", "SQL (banco.sql)", "Armazena informações de jogos, usuários e configurações.")
}

Rel(admin, web_app, "Usa", "HTTPS")
Rel(web_app, api_app, "Faz requisições para", "JSON/HTTPS")
Rel(api_app, database, "Lê e escreve dados em", "SQL")

' --- NÍVEL 3: COMPONENTES (do Container API Server) ---
Container_Boundary(api_boundary, "API Server") {
    Component(routes, "Routes", "Express Router", "Define as rotas de acesso e mapeia para os controllers apropriados.")
    Component(middlewares, "Middlewares", "Express Middleware", "Trata autenticação, validação e processamento de requisições.")
    Component(controllers, "Controllers", "JavaScript", "Implementa a lógica de negócio e orquestra o fluxo de dados.")
    Component(config, "Database Config", "JavaScript", "Gerencia a conexão e as credenciais do banco de dados.")
}

' Relacionamentos Internos do Nível 3
Rel(web_app, routes, "Envia requisições para")
Rel(routes, middlewares, "Passa por")
Rel(middlewares, controllers, "Encaminha para")
Rel(controllers, config, "Solicita acesso a dados")
Rel(config, database, "Executa queries em")
@enduml
