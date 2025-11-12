const Posts = require('../models/posts.js');
const Users = require('../models/users');

class PostController{
    async create(req, res){
        try {
            const { description, image, type, original_post_id } = req.body;
            const author_id = req.userId;

            if (type === 'RETWEET' || type === 'QUOTE_TWEET') {
                if (!original_post_id) {
                    return res.status(400).json({ 
                        message: "Retweets and Quote Tweets require an original_post_id" 
                    });
                }
            }

            const post = await Posts.create({
                description,        
                image,              
                type: type || 'TWEET', // Se 'type' não for enviado, recebe 'TWEET'
                author_id,          
                original_post_id    // Será nulo para TWEET
            });

            return res.status(201).json(post);
        } catch (error) {
            console.error("FALHA NO CREATE USER", error.message); 
            return res.status(500).json({message: "Failed to create post"})
        }
    }

    async index(req, res){
        const posts = await Posts.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Users,
                    as: 'author', 
                    attributes: ['id', 'name', 'user_name', 'avatar']
                },
                {
                    model: Posts,
                    as: 'original_post', 
                    include: {
                        model: Users,
                        as: 'author',
                        attributes: ['id', 'name', 'user_name']
                    }
                }
            ]
        });

        if (!posts) {
            return res.status(404).json({ message: 'No posts found' });
        }

        return res.status(200).json(posts);
    }

    async show(req, res){
        const { id } = req.params;
        const post = await Posts.findOne({
            where: { id: id },
            
            
            include: [
                {
                    model: Users,
                    as: 'author',
                    attributes: ['id', 'name', 'user_name', 'avatar']
                },
                {
                    model: Posts,
                    as: 'original_post',
                    include: {
                        model: Users,
                        as: 'author',
                        attributes: ['id', 'name', 'user_name']
                    }
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(post);
    }

    async delete(req, res){
        const user_id = req.userId;

        const { id } = req.params;

        const post = await Posts.findOne({
            where: { id: id }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author_id !== user_id) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this post' }); //403 É o código para "voce esta logado, mas nao tem permissao"
        }

        await post.destroy();

        return res.status(200).json({ message: 'Post deleted' });

    }
}

module.exports = new PostController();