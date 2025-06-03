const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/product', productController.getProduct);
router.get('/product/:id', productController.getProductById);
router.post('/product', productController.createProduct);
router.put('/product/:id', productController.UpdateProduct);
router.delete('/product/:id', productController.DeleteProduct);

module.exports = router;