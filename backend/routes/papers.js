const express = require('express');
const router = express.Router();
const { getPapers } = require('../controllers/papersController');
const { addPaper } = require('../controllers/papersController');
const { deletePaper } = require('../controllers/papersController');
const { searchPapers } = require('../controllers/papersController');
const {fetchGitHubRepos}=require('../controllers/githubController');
const { fetchFromArxiv } = require('../controllers/arxivController');
const {getPapersBySource }= require('../controllers/papersController');
const { authMiddleware } = require('../controllers/authController');
const {bookmarkPaper}=require('../controllers/papersController');
const {removeBookmark}=require('../controllers/papersController');
const {getTrendingPapers}=require('../controllers/papersController');



router.get('/search', authMiddleware,searchPapers);
router.get('/trending',getTrendingPapers);
router.get('/github/fetch',authMiddleware,fetchGitHubRepos);
router.get('/arxiv/fetch', authMiddleware,fetchFromArxiv);
router.get('/source/:source',authMiddleware,getPapersBySource);


router.post('/bookmark/:paperId', authMiddleware, bookmarkPaper);
router.delete('/bookmark/:paperId', authMiddleware, removeBookmark);

router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.user.id}` });
  }); 

router.get('/',authMiddleware,getPapers);
router.post('/addpaper', authMiddleware, addPaper);  
router.delete('/:id', authMiddleware, deletePaper);








module.exports = router;
