const router = require("express").Router();

const handle = require("../handlers");

router.post("/register", handle.register);

router.post("/newUser", handle.newUser);

router.post("/login", handle.login);

module.exports = router;
