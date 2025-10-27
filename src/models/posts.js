const Sequelize = require('sequelize');
const {Model} = require('sequelize');

class Posts extends Model {
    static init(sequelize) {
        super.init({
            description: Sequelize.STRING,
            image: Sequelize.STRING,
        },
        {
            sequelize,
        });
        return this;
    }

    
    static associate(models) {
        
        this.belongsTo(models.Users, { foreignKey: 'author_id', as: 'author' });

        
        this.hasMany(models.Likes, { foreignKey: 'post_id', as: 'likes' });
    }
}

module.exports = Posts;