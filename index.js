const fs = require("fs");

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL,
    database: "nodejs_rest_api",
    port: 3307,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Get all users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Create a new user
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        (err, result) => {
            if (err) throw err;
            res.json({
                message: "User added successfully",
                id: result.insertId,
            });
        }
    );
});

// Update a user
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id],
        (err) => {
            if (err) throw err;
            res.json({ message: "User updated successfully" });
        }
    );
});

// Delete a user
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.json({ message: "User deleted successfully" });
    });
});

app.get("/items", (req, res) => {
    let industrial = fs.readFileSync(__dirname + "/data/industrial.json");
    let json = JSON.parse(industrial);
    res.json(json);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
let uuid = require("uuid");


function get_count(){
  db.query("SELECT COUNT(*) FROM Items", (err, result) => {
    if (err) throw err;
    console.log(result);
    return result[0]["COUNT(*)"];
  });
} 

app.post("/postItem",(req, res) => {
    const Generated_ID = uuid.v4();
    let data = req.body;
    console.log(data);
    console.log("await me");
    
    for (let i = 0; i < data.length; i++) {
        let key = Object.keys(data[i])[0];
        const Product_ID = key;
        const Amount = parseInt(data[i][key]);
        Index_Number += i;

        db.query(
            "INSERT INTO Items (Product_ID, Amount ,Generated_ID) VALUES (?, ?, ?, ?)",
            [Product_ID, Amount, Generated_ID],
            (err, result) => {
                if (err) throw err;
            }
        );
    }

    res.status(200).json({ message: "worked!" });
});
