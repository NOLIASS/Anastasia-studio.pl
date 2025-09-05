const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// ===== Middleware =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// ===== SQLite база =====
const db = new sqlite3.Database("flowers.db");

// Створюємо таблиці, якщо їх ще нема
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS flowers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    season TEXT,
    image TEXT
  )`);
});

// ===== Multer для збереження картинок =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===== Middleware для перевірки адміна =====
function isAdmin(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.send("⛔ Доступ заборонено. Увійдіть у систему.");
  }
}

// ===== Маршрути =====

// Головна сторінка (можеш віддавати index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ===== API для галереї =====
app.get("/api/flowers", (req, res) => {
  db.all("SELECT * FROM flowers", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ===== Адмінка =====
app.get("/admin", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Додавання квітки
app.post("/add-flower", isAdmin, upload.single("image"), (req, res) => {
  const { name, price, season } = req.body;
  const imagePath = "/uploads/" + req.file.filename;

  db.run(
    "INSERT INTO flowers (name, price, season, image) VALUES (?, ?, ?, ?)",
    [name, price, season, imagePath],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.send("Помилка при додаванні квітки");
      }
      res.redirect("/admin");
    }
  );
});

// ===== Логін =====
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.send("Помилка бази даних");
    if (!user) return res.send("Користувача не знайдено");

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.userId = user.id;
        res.redirect("/admin");
      } else {
        res.send("Невірний пароль");
      }
    });
  });
});

// ===== Реєстрація =====
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.send("Помилка при хешуванні пароля");

    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash], (err) => {
      if (err) return res.send("Користувач вже існує або помилка бази даних");
      res.send("Реєстрація пройшла успішно! <a href='/login'>Увійти</a>");
    });
  });
});

// ===== Вихід =====
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ===== Запуск сервера =====
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
