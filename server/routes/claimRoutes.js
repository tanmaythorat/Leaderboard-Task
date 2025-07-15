const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");

router.get("/recent", claimController.getRecentClaims);
router.post("/", claimController.claimPoints);
router.get("/:userId", claimController.getUserClaims);

module.exports = router;