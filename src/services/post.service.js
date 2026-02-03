const prisma = require('@/libs/prisma');

class PostService {
    async getAllPosts() {
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                publishedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
        return posts;
    }
}

module.exports = new PostService();
