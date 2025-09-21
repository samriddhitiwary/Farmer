const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Update order status
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
