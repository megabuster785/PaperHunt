const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authMiddleware } = require('../controllers/authController');
const upload = require('../middleware/upload');


router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.get('/stats', authMiddleware, userController.getUserStats);
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);


router.get('/mypapers', authMiddleware, userController.getMyPapers);
router.get('/bookmarked', authMiddleware, userController.getMyBookmarkedPapers);
router.get('/bookmarkedIds',authMiddleware,userController.getBookmarkedPaperIds);

module.exports = router;

