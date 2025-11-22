const Users = require('../models/users')


class UserController{
    async create(req, res){
        const { name, user_name, email, password, is_admin, admin_pass } = req.body;
        
        // Verifica se o email já está cadastrado no banco
        const verifyUser = await Users.findOne({ //sequelize faz um select where no BD
            where: {
                email: req.body.email
            },
        })

        if(verifyUser){
            return res.status(400).json({message: 'Email already exists'})
        }

        let roleAdmin = false;

        
        if (is_admin === true && admin_pass === "SenhaDevSecreta") { //Para criar um USER ADM, é preciso saber a senha
            roleAdmin = true;
        }

        const user = await Users.create({
                name,
                user_name,
                email,
                password: password,
                is_admin: roleAdmin
            });
        
        if(!user){
            return res.status(400).json({message: 'Failed to create a user'})

        }
        
        return res.send({message: 'User created'});
    }

    async update(req, res){
        const {old_password, new_password, confirm_new_password} = req.body;

        const user = await Users.findOne({
            where:{
                id: req.userId, 
            }
        })

        if(!user){
            return res.status(400).json({message: "User not exists"});
        }

        // Valida a senha antiga e compara a nova com a confirmação
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

        
        await user.save();
        return res.status(200).json({message: 'User updated'});
    }

    async delete(req, res){
        // Verifica e remove o usuário logado 
        const userToDelete = await Users.findOne({
            where:{
                id: req.userId
            },
        });

        if(!userToDelete){
            return res.status(400).json({message: "User does not exists"});
        }

        await Users.destroy({
            where:{
                id: req.userId,
            },
        });

        return res.status(200).json({message: "User deleted"});
    }

    async userProfile(req, res){
        const {id: userId} = req.params; 
        
        // Busca perfil público de um usuário específico pelo ID
        const user = await Users.findOne({
            where:{
                id: userId
            },
        })

        if(!user){
            return res.status(400).json({message: "User does not exists"});
        }

        const {id, name, user_name, email, avatar, bio} = user;
        return res.status(200).json({ user: {id, name, user_name, email, avatar, bio}});
    }
}

module.exports = new UserController();