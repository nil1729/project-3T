const router = require("express").Router();
const asyncHandler = require("../middleware/asyncHandler");

async function createGame(req, res, next) {
  console.log("Create Game");
}

// POST /api/v1/game/create (Create Game)
// Access: Public
router.post("/create", asyncHandler(createGame));

module.exports = router;
