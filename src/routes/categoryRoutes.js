const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.get('/category', categoryController.getCategory);
router.get('/category/:id', categoryController.getCategoryById);
router.post('/category', categoryController.createCategory);
router.put('/category/:id', categoryController.UpdateCategory);
router.delete('/category/:id', categoryController.DeleteCategory);

module.exports = router;