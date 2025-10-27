const {Model} = require('sequelize');

class Likes extends Model {
    static init(sequelize) {
        super.init({}, { sequelize });
        return this;
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: 'user_id' });
        this.belongsTo(models.Posts, { foreignKey: 'post_id' });
    }
}

module.exports = Likes;