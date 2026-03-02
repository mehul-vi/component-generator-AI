const express = require("express")
const router = express.Router()

const historyController = require("../controller/history.controller")

// POST - Save history
router.post(
  "/history",
  historyController.saveHistory
)

// GET - Fetch user history
router.get(
  "/history",
  historyController.getUserHistory
)

module.exports = router