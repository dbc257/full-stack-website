const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const pgp = require("pg-promise")();
const connectionString = "postgres://localhost:5432/blogdb";
const db = pgp(connectionString);

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");
app.use(express.urlencoded());

app.get("/posts", (req, res) => {
  db.any(
    "SELECT postid, title, body, is_published, date_created, date_updated FROM posts;"
  ).then((results) => {
    res.render("posts", { allPosts: results });
  });
});

app.get("/add-post", (req, res) => {
  res.render("add-post");
});

app.post("/add-post", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let is_published = req.body.is_published == "on" ? true : false;
  db.none("INSERT INTO posts(title, body, is_published) VALUES($1,$2,$3)", [
    title,
    body,
    is_published,
  ]).then(() => {
    res.redirect("/posts");
  });
});

app.listen(3000, () => {
  console.log("Server is running...");
});
