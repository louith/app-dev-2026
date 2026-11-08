const express = require('express');
const router = express.Router();
const {
    getAllPosts,
    getPostsByUsername,
    createPost
} = require('../controllers/postsController');

// Mounted at /posts in app.js
router.get('/', getAllPosts);
router.get('/:username', getPostsByUsername);
router.post('/', createPost);

module.exports = router;