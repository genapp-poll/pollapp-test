const router = require("express").Router();

const handle = require("../handlers");
const auth = require("../middlewares/auth");

router.route("/").get(handle.showAllUsers); //show everything
//to use middleware, add auth before the post route
//anywhere we use the middleware, we have access to req.decoded which gives us userid
//const {id} = req.decoded

// router.get("/profile", auth, handle.specificUser;

router.route("/:id").get(handle.getUser).post(auth, handle.updateXp);
//   .delete(auth, handle.deleteUser);
// accesses by req.params

module.exports = router;
