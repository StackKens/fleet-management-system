const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8000;

const authMiddleware = require("./middleware/authMiddleware");

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const users = [
  { id: 1, name: "alex" },
  { id: 2, name: "stackkens" },
  { id: 3, name: "peter" },
];

app.get("/", (req, res) => {
  res.send("Hello from express");
});

app.get("/about", (req, res) => {
  res.send("Hello from about page");
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User No found!" });
  }
  res.json(user);
});

app.post("/api/auth/user/login", authMiddleware, (req, res) => {
  console.log(req.body);
  res.json(req.body);
});
app.listen(PORT, () => {
  console.log("Server is running");
});
