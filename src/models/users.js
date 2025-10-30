const Sequelize = require('sequelize');
const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

class Users extends Model{
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            user_name: Sequelize.STRING,      
            email: Sequelize.STRING,                           
            avatar: Sequelize.STRING,            
            bio: Sequelize.STRING,
            password: Sequelize.VIRTUAL,          //este campo nao existe na tabela; mas é necessario para fazer o hash na hora de salvar o user no banco  
            password_hash: Sequelize.STRING,       
        },
        {
            sequelize,
        }
    )
    this.addHook('beforeSave', async(user) => {
        if(user.password){
            user.password_hash = await bcrypt.hash(user.password, 8);
        }
    })

    return this;
        
    }
    static associate(models) {
        this.hasMany(models.Posts, { foreignKey: 'author_id', as: 'posts' });
        this.hasMany(models.Likes, { foreignKey: 'user_id', as: 'likes' });
    }
}

module.exports = Users;