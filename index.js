let express = require("express");
let morgan = require("morgan");
let mongoose = require("mongoose");
let Blog = require("./models/blog");

// express app
let app = express();

// connecting database and running server
const mongodb =
  "mongodb+srv://samurai:root@cluster0.vosfa.mongodb.net/pr0ject_0?retryWrites=true&w=majority";

mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("database is connected");
    app.listen(5000);
    console.log("server running on 5000");
  })
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "create new blog" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) =>
      res.render("index", { blogs: result, title: "all blogs" })
    )
    .catch((err) => console.log(err));
});

// posting blogs
app.post("/blogs", (req, res) => {
  let blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/blogs");
    })
    .catch((err) => console.log(err));
});

app.get("/blogs/:id", (req, res) => {
  let id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: result.title });
    })
    .catch((err) => console.log(err));
});

app.delete("/blogs/:id", (req, res) => {
  let id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
});

// 404 error page not found
app.use((req, res) => {
  res.status(404).render("404", { title: "page not found" });
});
