const postService = require('@/services/post.service');

const getAllPosts = async (req, res) => {
    const posts = await postService.getAllPosts();
    res.success(posts);
};

module.exports = { getAllPosts };
