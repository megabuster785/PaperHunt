const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/token', authController.refreshToken);           
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);


module.exports = router;
