import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey";

const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

await db.exec(`
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

const adminExists = await db.get(
  `SELECT * FROM users WHERE role='super-admin'`
);
if (!adminExists) {
  const hash = await bcrypt.hash("admin123", 10);
  await db.run(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    "Super Admin",
    "superadmin@example.com",
    hash,
    "super-admin"
  );
}

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET
  );
  res.json({ token, role: user.role, name: user.name });
});

app.get("/users", auth, async (req, res) => {
  const users = await db.all("SELECT id, name, email, role FROM users");
  res.json(users);
});

app.post("/users", auth, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role === "admin" && req.user.role !== "super-admin")
    return res.status(403).json({ message: "Not allowed" });
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.run(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      name,
      email,
      hash,
      role
    );
    res.json({ message: "User added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/loans", auth, async (req, res) => {
  const loans = await db.all("SELECT * FROM loans");
  res.json(loans);
});

app.post("/loans", auth, async (req, res) => {
  const { borrower, item, date_borrowed, due_date } = req.body;
  await db.run(
    "INSERT INTO loans (borrower,item,date_borrowed,due_date) VALUES (?,?,?,?)",
    borrower,
    item,
    date_borrowed,
    due_date
  );
  res.json({ message: "Loan added" });
});

app.put("/loans/:id/return", auth, async (req, res) => {
  const { id } = req.params;
  await db.run("UPDATE loans SET returned=1 WHERE id=?", id);
  res.json({ message: "Loan returned" });
});

app.delete("/loans/:id", auth, async (req, res) => {
  if (req.user.role !== "super-admin")
    return res.status(403).json({ message: "Not allowed" });
  const { id } = req.params;
  await db.run("DELETE FROM loans WHERE id=?", id);
  res.json({ message: "Loan deleted" });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
