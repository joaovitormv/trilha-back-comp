const Posts = require('../models/posts.js');
const Users = require('../models/users');
const { Sequelize } = require('sequelize');

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

            attributes: {
                include: [
                    [
                        Sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Posts.id)'),
                        'likes_count'
                    ]
                ]
            },

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
            
            attributes: {
                include: [
                    [
                        Sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.post_id = Posts.id)'),
                        'likes_count' //Mostra a qtd de likes do post
                    ]
                ]
            },
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

    async update(req, res){
        const user_id = req.userId;

        const {id} = req.params;

        const {description} = req.body;

        const post = await Posts.findOne({
            where: {id: id}
        });

        if(!post){
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author_id !== user_id) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this post' });
        }

        post.description = description; //No twitter, só é possível editar a descrição

        await post.save();

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

    async adminDelete(req, res) {
        const { id } = req.params;

        const post = await Posts.findOne({
            where: { id: id }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Não há verificação de autoria. O admin pode deletar
        await post.destroy();

        return res.status(200).json({ message: 'Post deleted by admin' });
    }
}

module.exports = new PostController();