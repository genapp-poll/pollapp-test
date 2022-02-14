const router = require("express").Router();

const handle = require("../handlers");
const auth = require("../middlewares/auth");

router.route("/").get(handle.showAllSchools); //show everything
//to use middleware, add auth before the post route
//anywhere we use the middleware, we have access to req.decoded which gives us userid
//const {id} = req.decoded
router.route("/:id").get(handle.getSchool).post(auth, handle.updateSchool);

module.exports = router;
