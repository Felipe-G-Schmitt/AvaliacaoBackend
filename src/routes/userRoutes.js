const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
router.use(userController.ValidarToken)

router.get('/user', userController.getUser);
router.get('/user/:id', userController.getUserById);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.UpdateUser);
router.delete('/user/:id', userController.DeleteUser);

module.exports = router;