const Sequelize = require('sequelize');
const {Model} = require('sequelize');

class Posts extends Model {
    static init(sequelize) {
        super.init({
            description: Sequelize.STRING,
            image: Sequelize.STRING,
            type: Sequelize.STRING,
            original_post_id: Sequelize.INTEGER,
        },
        {
            sequelize,
        });
        return this;
    }

    
    static associate(models) {
        
        this.belongsTo(models.Users, { foreignKey: 'author_id', as: 'author' });

        this.hasMany(models.Likes, { foreignKey: 'post_id', as: 'likes' });

        this.belongsTo(models.Posts, { 
            foreignKey: 'original_post_id', 
            as: 'original_post' 
        });

        this.hasMany(models.Posts, {
            foreignKey: 'original_post_id',
            as: 'retweets'
        });
    }
}

module.exports = Posts;