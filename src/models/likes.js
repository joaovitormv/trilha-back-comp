const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Likes extends Model {
    static init(sequelize) {
        super.init({
            user_id: Sequelize.INTEGER,
            post_id: Sequelize.INTEGER
        }, {
            sequelize,
            modelName: 'Likes', 
            tableName: 'likes' 
        });        
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.Posts, { foreignKey: 'post_id', as: 'post' });
    }
}

module.exports = Likes;