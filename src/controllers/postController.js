const Posts = require('../models/posts.js');

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
            return res.status(500).json({message: "Failed to create post"})
        }
    }
}

module.exports = new PostController();