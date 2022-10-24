let express = require("express");
let morgan = require("morgan");
let mongoose = require("mongoose");

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
  res.render("index");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "page not found" });
});
