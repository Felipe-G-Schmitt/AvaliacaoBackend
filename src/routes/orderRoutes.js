const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

router.get('/order', orderController.getOrder);
router.get('/order/:id', orderController.getOrderById);
router.post('/order', orderController.createOrder);
router.put('/order/:id', orderController.UpdateOrder);
router.delete('/order/:id', orderController.DeleteOrder);

module.exports = router;