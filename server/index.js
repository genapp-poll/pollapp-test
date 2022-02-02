const express = require("express");

const handle = require("./handlers/index");

const app = express();
const port = 4000;

app.get("/", (req, res) => res.json({ hello: "world" }));
//(req, res) => res.json({ hello: "world" }) <--- middleware function

app.use(handle.notFound);
app.use(handle.errors);

app.listen(port, console.log(`Server started on port ${port}`));
