const router = require("express").Router();

const handle = require("../handlers");
const auth = require("../middlewares/auth");

router.route("/").get(handle.showPolls).post(auth, handle.createPoll); //show everything
//to use middleware, add auth before the post route
//anywhere we use the middleware, we have access to req.decoded which gives us userid
//const {id} = req.decoded

router.get("/user", auth, handle.usersPolls);

router.route("/leaderboard").get(handle.getLeaderBoard);

router
  .route("/:id")
  .get(handle.getPoll)
  .post(handle.vote)
  .delete(auth, handle.deletePoll);
//accesses by req.params

router.route("/:id/comments").post(handle.comment);
router.route("/:poll_id/:comment_id/like").post(handle.like_comment);

module.exports = router;
