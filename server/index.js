require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./models");
//can use db.Poll or db.User

const handle = require("./handlers/index");
const routes = require("./routes");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ hello: "world" }));
//(req, res) => res.json({ hello: "world" }) <--- middleware function
app.use("/api/auth", routes.auth);
app.use("/api/polls", routes.poll);
app.use("/api/users", routes.user);
app.use("/api/schools", routes.school);

app.use(handle.notFound);
app.use(handle.errors);

app.listen(port, console.log(`Server started on port ${port}`));
