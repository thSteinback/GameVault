// =============================================================================
//  GameVault — Autenticação em C# (ASP.NET Core / Minimal API)
//  Equivalente ao arquivo Node.js: controllers/authController.js
//
//  Objetivo: comparar a MESMA lógica (cadastro + login com bcrypt e JWT)
//  escrita em JavaScript (Node/Express) e em C# (.NET).
//
//  Pacotes NuGet necessários:
//    dotnet add package MySqlConnector
//    dotnet add package Dapper
//    dotnet add package BCrypt.Net-Next
//    dotnet add package System.IdentityModel.Tokens.Jwt
// =============================================================================

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Equivalente ao process.env do Node (lê variáveis de ambiente)
string connString = Environment.GetEnvironmentVariable("DB_CONN")
    ?? "Server=localhost;Database=gamevault;User=root;Password=;";
string jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "segredo";

// Tipos fortes (em JS isso seria só um objeto solto)
record CadastroDto(string? Nome, string? Email, string? Senha);
record LoginDto(string? Nome, string? Senha);
record UsuarioLogin(int USU_COD, string senhaDB, string USU_TIPO);

// -----------------------------------------------------------------------------
//  POST /cadastrar   (equivale a exports.cadastrar)
// -----------------------------------------------------------------------------
app.MapPost("/cadastrar", async (CadastroDto body) =>
{
    var (nome, email, senha) = body;

    bool emailOk = Regex.IsMatch(email ?? "", @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
    bool senhaOk = Regex.IsMatch(senha ?? "", @"^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$");

    if (string.IsNullOrWhiteSpace(nome))
        return Results.Json(new { success = false, message = "Nome de usuário obrigatório" });
    if (!emailOk)
        return Results.Json(new { success = false, message = "E-mail inválido" });
    if (!senhaOk)
        return Results.Json(new { success = false, message = "Senha fraca: mín. 8 caracteres, 1 maiúscula e 1 número" });

    try
    {
        await using var conn = new MySqlConnection(connString);

        // Consulta parametrizada (no Node era o "?" do mysql2; aqui são @parâmetros)
        var existe = await conn.QueryAsync<int>(
            "SELECT 1 FROM usuarios WHERE USU_NOME = @nome OR USU_EMAIL = @email",
            new { nome, email });
        if (existe.Any())
            return Results.Json(new { success = false, message = "Nome ou e-mail já existe" });

        string senhaHash = BCrypt.Net.BCrypt.HashPassword(senha, 10);

        await conn.ExecuteAsync(
            "INSERT INTO usuarios (USU_NOME, USU_EMAIL, USU_SENHA) VALUES (@nome, @email, @senhaHash)",
            new { nome, email, senhaHash });
        int novoId = await conn.QuerySingleAsync<int>("SELECT LAST_INSERT_ID()");

        await conn.ExecuteAsync(
            "INSERT IGNORE INTO permissoesusuarios (USU_COD, PERM_BANIDO, PERM_STRIKES, PERM_COMENTAR) VALUES (@id, 0, 0, 1)",
            new { id = novoId });

        return Results.Json(new { success = true, message = "Usuário cadastrado com sucesso" });
    }
    catch (Exception e)
    {
        Console.Error.WriteLine(e);
        return Results.Json(new { success = false, message = "Erro ao cadastrar" }, statusCode: 500);
    }
});

// -----------------------------------------------------------------------------
//  POST /login   (equivale a exports.login)
// -----------------------------------------------------------------------------
app.MapPost("/login", async (LoginDto body) =>
{
    var (nome, senha) = body;
    if (string.IsNullOrEmpty(nome) || string.IsNullOrEmpty(senha))
        return Results.Json(new { success = false, message = "Preencha todos os campos" }, statusCode: 400);

    try
    {
        await using var conn = new MySqlConnection(connString);

        var user = await conn.QueryFirstOrDefaultAsync<UsuarioLogin>(
            "SELECT USU_COD, USU_SENHA AS senhaDB, USU_TIPO FROM usuarios WHERE USU_NOME = @login OR USU_EMAIL = @login",
            new { login = nome });

        if (user is null || !BCrypt.Net.BCrypt.Verify(senha, user.senhaDB))
            return Results.Json(new { success = false, message = "Credenciais Inválidas" });

        bool ehAdmin = user.USU_TIPO == "admin";

        // Geração do JWT (equivale ao jwt.sign do Node)
        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);
        var jwt = new JwtSecurityToken(
            claims: new[]
            {
                new Claim("id", user.USU_COD.ToString()),
                new Claim("nome", nome),
                new Claim("admin", ehAdmin.ToString().ToLower())
            },
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credenciais);
        string token = new JwtSecurityTokenHandler().WriteToken(jwt);

        return Results.Json(new { success = true, isAdmin = ehAdmin, token });
    }
    catch (Exception e)
    {
        Console.Error.WriteLine(e);
        return Results.Json(new { success = false, message = "Erro no servidor" }, statusCode: 500);
    }
});

app.Run();
