const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "user0",
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to fetch all users
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Route to fetch a single user by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  pool.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// Route to create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

// Route to update a user by ID
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  pool.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Route to delete a user by ID
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  pool.query("DELETE FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
