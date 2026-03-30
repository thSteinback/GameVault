# Desenvolvido por Thomas Henry Steinback

DIAGRAMA C4
//www.plantuml.com/plantuml/png/jLNDRjj64BxhAQQ-L0RqWpGvvHH7LXq7igoQSjAUX15t96-mtALdbxBZ8e_GXp1wA5eWfw1Fm1ShXwH84NQFEOaxkplVDzzyEthZ0tB84jFxGTlOP8hW9eJKlnwF6Uz6MnrkidNcYMDd0zamYbqoJWrQkJFqGHcz7azU3HSIkhwOZHFqWRW8hIR53TIMU9H-f_n9wgpSAVFtVeG2SQEt6MF-L_ulUJWZHkrxivFVBg-Ngu_dotUhsVHiEZ_j7_U23eRWLEEMCK6Ol88XHDe7AXPdcD07p4oGfCFX4ERv7n-cCtZn6YQNy-Nqr-MbX7iBOkzi7rMYxG2EJkHN-y2e71yLWMkVvO-i7J3vWghF7tTa87KCMsAoiKO61p66_D6uhGD5yAduzK0GTqi1vS1Nx4P7nxteitpsjvZGJdYkV1ae81lgWh-lHr43c90D9T1QhursWM9iOMypWfGuqO70yHQjVa0-9CCGygyXCyuBYzuLcNtnpr6f8O5Wfts6fiXM0GctTylb8f8a7OL_gXG-EPzFhoBPg4jTlNMPLSYV-_6BJfN7y7iF0A0nM_-ErYjCK-b7QdGi0lxfu2EjAzIBsG0cKJI0zxZ3A6QTbbATsq2ymPW00-Ck_zk3ma8GDE003niBMexYLcH9eDEMBX5CzPx8uXmYuXsLhfWxHQDFVW3J-vJ9bseisEtoVm31vD-skkg9fMt-BTOE2CYgr1Mu7b9a10GyAAqe-0duwRglCE0QFHNPtwADowQVeghKZtwPGNyjuP6_DSSIEk447yWYQBjndDJ6QymnWAnsypFs5Fml7J-qNRZsUDXlETDijXBzZ0_0T9jfhsjWgLGkleykv-F3sysbWmfdXNW4v6Ec7O6ICe6Ikj8dBdifBhjONCwdnMEEeAzSgnoqpJek3TZij1uK1kjwqMrlQyTwDlNPPO5ySUgg_11ATTz18fKbJcbJ801wO1Um51rZybvwds1A6gl6Eo_A1tR647l0b5tA6bNr7hl0YLRAq1roYNxHh3eKsh14bum10JCPn7jx3M27HglQQmG5f31h1qcdQqzfj7o5ngHTbRtjli4aDIHvyNyVWkFRZ7mGAM1ZilkIWNfUWCgZecxja_h_uGbmEwbGvANxgbBq43EfSaUN4rWUJ1VnYpYhC2KMz6obYOTobbXNNfddNsNcl-pwlZ75rEuqFcFyskhxSzrUBj1xXDHnVQgpszLxQcDCjBt1mwoT8urAaJCwrW7tpiEgokQE7EkykUaznLcG8KciITvRSVODMPKbvZy0





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
