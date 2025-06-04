const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const registerMiddle = require('../middlewares/registerMiddle');

router.get('/user', userController.getUser);
router.get('/user/:id', userController.getUserById);
router.post('/user', registerMiddle.createUser);
router.put('/user/:id', userController.UpdateUser);
router.delete('/user/:id', userController.DeleteUser);

module.exports = router;