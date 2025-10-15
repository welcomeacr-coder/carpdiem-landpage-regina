// server.js

import express from "express";
import mysql from "mysql2";
import path from "path";

const app = express();
const __dirname = path.resolve();

// ==============================
// 🔹 CONFIGURAÇÃO DO BANCO MYSQL
// ==============================
const db = mysql.createConnection({
  host: "127.0.0.1",       // ou "localhost"
  user: "nodeuser2",       // usuário criado
  password: "Gringotts12@", // senha do usuário
  database: "meu_banco"    // nome do banco
});

// Testar conexão
db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err.message);
  } else {
    console.log("✅ Conectado ao MySQL!");
  }
});

// ==============================
// 🔹 MIDDLEWARES
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // serve index.html, admin.html, login.html

// ==============================
// 🔹 ROTAS DE TESTE
// ==============================

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para buscar clientes
app.get("/api/clientes", (req, res) => {
  const sql = "SELECT * FROM clientes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar clientes:", err);
      res.status(500).json({ erro: "Erro ao buscar clientes" });
    } else {
      res.json(results);
    }
  });
});

// Rota para cadastrar cliente
app.post("/api/clientes", (req, res) => {
  const { nome, email } = req.body;
  const sql = "INSERT INTO clientes (nome, email) VALUES (?, ?)";
  db.query(sql, [nome, email], (err, result) => {
    if (err) {
      console.error("Erro ao inserir cliente:", err);
      res.status(500).json({ erro: "Erro ao inserir cliente" });
    } else {
      res.json({ sucesso: true, id: result.insertId });
    }
  });
});

// ==============================
// 🔹 INICIAR SERVIDOR
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
