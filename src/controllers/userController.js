const Users = require('../models/users')

class UserController{
    async create(req, res){
        const { name, user_name, email, password } = req.body;
        
        const verifyUser = await Users.findOne({ //sequelize faz um select where no BD
            where: {
                email: req.body.email
            },
        })

        if(verifyUser){
            return res.status(400).json({message: 'Email already exists'})
        }

        const user = await Users.create({
                name,
                user_name,
                email,
                password: password 
            });
        
        if(!user){
            return res.status(400).json({message: 'Failed to create a user'})

        }
        
        return res.send({message: 'User created'});
    }
}

module.exports = new UserController();