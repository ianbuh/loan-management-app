import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

// --- Absolute path setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "database.db");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.SECRET || "supersecretkey";

app.use(cors({ origin: "*" }));
app.use(express.json());

// --- Use absolute path for database ---
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  );
  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    borrower TEXT,
    item TEXT,
    date_borrowed TEXT,
    due_date TEXT,
    returned INTEGER DEFAULT 0
  );
`);

// Create default super-admin
const adminExists = db
  .prepare(`SELECT * FROM users WHERE role='super-admin'`)
  .get();
if (!adminExists) {
  const hash = bcrypt.hashSync("admin123", 10);
  db.prepare(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)"
  ).run("Super Admin", "superadmin@example.com", hash, "super-admin");
}

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET
  );
  res.json({ token, role: user.role, name: user.name });
});

app.get("/users", auth, (req, res) => {
  const users = db.prepare("SELECT id, name, email, role FROM users").all();
  res.json(users);
});

app.post("/users", auth, (req, res) => {
  const { name, email, password, role } = req.body;
  if (role === "admin" && req.user.role !== "super-admin")
    return res.status(403).json({ message: "Not allowed" });
  const hash = bcrypt.hashSync(password, 10);
  try {
    db.prepare(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)"
    ).run(name, email, hash, role);
    res.json({ message: "User added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/loans", auth, (req, res) => {
  try {
    const loans = db
      .prepare("SELECT * FROM loans ORDER BY date_borrowed DESC")
      .all();
    res.json(loans);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve loans", error: err.message });
  }
});

app.post("/loans", auth, (req, res) => {
  try {
    const { borrower, item, date_borrowed, due_date } = req.body;
    const info = db
      .prepare(
        "INSERT INTO loans (borrower, item, date_borrowed, due_date) VALUES (?, ?, ?, ?)"
      )
      .run(borrower, item, date_borrowed, due_date);
    res.status(201).json({ message: "Loan added", id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ message: "Failed to add loan", error: err.message });
  }
});

app.put("/loans/:id/return", auth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE loans SET returned=1 WHERE id=?").run(id);
    res.json({ message: "Loan returned" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to return loan", error: err.message });
  }
});

app.delete("/loans/:id", auth, (req, res) => {
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ message: "Not allowed" });
  }
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM loans WHERE id=?").run(id);
    res.json({ message: "Loan deleted" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to delete loan", error: err.message });
  }
});

// Serve frontend build
// This assumes your frontend build output is in a 'dist' folder at the project root
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// For any other route, serve index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
