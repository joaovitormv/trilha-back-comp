const Posts = require('../models/posts');
const Likes = require('../models/likes');

class LikeController {
    async create(req, res){
        const {id: post_id} = req.params;
        const user_id = req.userId;

        // Verifica se o post alvo existe
        const post = await Posts.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Tenta criar o like, mas retorna o existente caso já haja um registro (evita duplicatas)
        const [like, created] = await Likes.findOrCreate({ 
            where: {
                user_id: user_id,
                post_id: post_id
            }
        });

        if (!created) {
            return res.status(400).json({ message: 'User already liked this post' });
        }

        return res.status(201).json(like);
    }

    async delete(req, res){
        const {id: post_id} = req.params;
        const user_id = req.userId;

        // Busca o like específico deste usuário neste post
        const like = await Likes.findOne({
            where:{
                user_id: user_id,
                post_id: post_id
            }
        })

        if(!like){
            return res.status(404).json({ message: 'Like not found' });
        }

        // Remove o like do banco de dados
        await like.destroy();

        return res.status(200).json({ message: 'Like removed' });
    }
}

module.exports = new LikeController();