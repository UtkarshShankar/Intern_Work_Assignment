// server/routes/pollRoutes.js

const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post("/create", pollController.createPoll);
router.post("/submit", pollController.submitAnswer);
router.get("/history", pollController.getPollHistory);
router.get("/active", pollController.getActivePollStatus);

module.exports = router;
