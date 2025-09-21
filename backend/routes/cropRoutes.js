const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

// Add new crop
router.post('/', cropController.addCrop);

// Get all crops
router.get('/', cropController.getAllCrops);

// Get crop by ID
router.get('/:id', cropController.getCropById);

// Update crop
router.put('/:id', cropController.updateCrop);

// Delete crop
router.delete('/:id', cropController.deleteCrop);

module.exports = router;
