import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = "supersecretkey";

app.use(cors({ origin: "http://localhost:5173" })); // Update with your frontend URL
app.use(express.json());

// Open SQLite database
const db = new Database("./database.db");

// Create tables if they don't exist
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

// Create default super-admin if none exists
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
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    SECRET
  );
  res.json({ token, role: user.role, name: user.name });
});

// Get all users
app.get("/users", auth, (req, res) => {
  const users = db.prepare("SELECT id, name, email, role FROM users").all();
  res.json(users);
});

// Add user
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

// Get loans
app.get("/loans", auth, (req, res) => {
  const loans = db.prepare("SELECT * FROM loans").all();
  res.json(loans);
});

// Add loan
app.post("/loans", auth, (req, res) => {
  const { borrower, item, date_borrowed, due_date } = req.body;
  db.prepare(
    "INSERT INTO loans (borrower,item,date_borrowed,due_date) VALUES (?,?,?,?)"
  ).run(borrower, item, date_borrowed, due_date);
  res.json({ message: "Loan added" });
});

// Return loan
app.put("/loans/:id/return", auth, (req, res) => {
  const { id } = req.params;
  db.prepare("UPDATE loans SET returned=1 WHERE id=?").run(id);
  res.json({ message: "Loan returned" });
});

// Delete loan
app.delete("/loans/:id", auth, (req, res) => {
  if (req.user.role !== "super-admin")
    return res.status(403).json({ message: "Not allowed" });
  const { id } = req.params;
  db.prepare("DELETE FROM loans WHERE id=?").run(id);
  res.json({ message: "Loan deleted" });
});

// Start server
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
