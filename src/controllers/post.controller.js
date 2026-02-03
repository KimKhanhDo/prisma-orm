const postService = require('@/services/post.service');

const getAllPosts = async (req, res) => {
    const posts = await postService.getAllPosts();
    throw 123;
    res.success(posts);
};

module.exports = { getAllPosts };
