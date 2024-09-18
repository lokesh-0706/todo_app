const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

let cnt = 0;
let todos = [];
let users = [];
const JWT_SECRET = "loks";
fs.readFile("db.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("Data base crashed");
  } else {
    todos = JSON.parse(data);
  }
});

app.use(express.json());
app.use(cors());

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let newUser = { username, password };
  users.push(newUser);
  todos.push({ username, allTodos: [] });
  res.status(200).send({
    message: "User signed up successfully",
  });
});

app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let foundUser = users.find(
    (i) => i.username == username && i.password == password
  );
  if (foundUser) {
    const token = jwt.sign({ username: username }, JWT_SECRET);
    res.status(200).json({
      token: token,
    });
    return;
  }
  res.send("Invalid User");
  return;
});

app.get("/me", (req, res) => {
  const token = req.headers.token;
  const username = jwt.verify(token, JWT_SECRET);
  res.send({ username: username.username });
});

// app.get("/home", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

app.get("/todos/", (req, res) => {
  const token = req.headers.token;
  const username = jwt.verify(token, JWT_SECRET);
  const index = users.findIndex((i) => i.username == username.username);
  console.log(todos);
  res.json(todos[index].allTodos);
});

app.get("/todos/:id", (req, res) => {
  const ans = todos.find((todo) => todo.id == req.params.id);
  if (!ans) {
    res.status(404).send("Please enter a valid id");
  }
  res.json(ans);
});

app.post("/todos/", (req, res) => {
  const data = req.body;
  const token = req.headers.token;
  const username = jwt.verify(token, JWT_SECRET);
  const index = users.findIndex((i) => i.username == username.username);
  let newTodo = {};
  newTodo.id = ++cnt;
  newTodo.task = data.task;
  todos[index].allTodos.push(newTodo);
  fs.writeFile("db.txt", JSON.stringify(todos), (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File written successfully!");
    }
  });
  res.send("Todo added successfully");
});

app.put("/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id == req.params.id);
  if (index == -1) {
    res.status(404).send("Enter valid id");
  }
  todos[index].task = req.body.task;
  fs.writeFile("db.txt", JSON.stringify(todos), (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File written successfully!");
    }
  });
  res.json(todos[index]);
});

app.delete("/todos/:id", (req, res) => {
  const token = req.headers.token;
  const username = jwt.verify(token, JWT_SECRET);
  const index = users.findIndex((i) => i.username == username.username);
  const ans = todos[index].allTodos.filter((todo) => todo.id != req.params.id);
  todos[index].allTodos = ans;
  console.log(ans);
  fs.writeFile("db.txt", JSON.stringify(todos), (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log("File written successfully!");
    }
  });
  res.send("Deleted successfully");
});

app.listen(3000);
