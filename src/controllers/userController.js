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

    async update(req, res){
        const {name, avatar, bio, old_password, new_password, confirm_new_password} = req.body;

        const user = await Users.findOne({
            where:{
                id: req.userId, 
            }
        })

        if(!user){
            return res.status(400).json({message: "User not exists"});
        }


        if(old_password){
            if(!await user.checkPassword(old_password)){
                return res.status(401).json({error: "Old password does not match"});
            }
            if(!new_password || !confirm_new_password){
                return res.status(401).json({
                    error: "We need a new_password and confirm_new_password attributes",
                })
            }
            if(new_password != confirm_new_password){
                return res.status(401).json({error: "New password and confirm new password does not match"});
            }

            user.password = new_password;
        }

        await Users.update({
            name: name || user.name,
            avatar: avatar || user.avatar,
            bio: bio || user.bio,
        },
        {
            where:{
                id: user.id,
            }
        });
        await user.save();
        return res.status(200).json({message: 'User updated'});
    }
}

module.exports = new UserController();