const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// Add or update prediction
router.post('/', predictionController.addPrediction);

// Get prediction by crop & region
router.get('/', predictionController.getPrediction);

module.exports = router;
