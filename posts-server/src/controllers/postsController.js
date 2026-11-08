const posts = require('../data/posts');

const getAllPosts = (req, res) => {
    res.json(posts);
};

//Get posts by username
const getPostsByUsername = (req, res) => {
    const userPosts = posts.filter(post => post.username === req.params.username);
    if (userPosts.length === 0){
        return res.status(404).json({ message: 'No posts found for this user.' });
    } 
    res.json(userPosts);
}

//POST create post
const createPost = (req, res) => {
    const {title, content, author, username} = req.body;
    if (!title || !content || !author || !username) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const newPost = { title, content, author, username };
    posts.push(newPost);
    res.status(201).json(newPost);

};

module.exports = {
    getAllPosts,
    getPostsByUsername,
    createPost
};