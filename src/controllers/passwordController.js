const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const Mail =require('../configs/mail');


class PasswordController{
    async create(req, res){
        const {email}= req.body;
        const user = await Users.findOne({
            where: {email: email}
        })
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const token = jwt.sign(
            {id : user.id},
            process.env.HASH_BCRYPT,
            {expiresIn: '15m'}
        );

        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        try{
            await Mail.sendMail({
                from: "Projeto Tuiter <noreply@tuiter.com>",
                to: `${user.name} <${user.email}>`,
                subjet: 'Recuperação de Senha',
                text: `Copie este token: ${token}. Clique no link para redefinir sua senha: ${resetUrl} (quando houver o frontEnd).`

            });
            
        } catch(err){
            console.error("Failed to send password reset email", err);
            return res.status(500).json({message: "Failed to send email"});
        }

        console.log("EMAIL ENVIADO (No Mailtrap)");
        console.log("Link de Recuperação:", resetUrl);
        console.log("Token:", token);

        return res.status(200).json({message: "Password reset email sent"});
    }

    async update(req, res){
        const {token, new_password, confirm_new_password} = req.body;

        if(!new_password || !confirm_new_password){
            return res.status(400).json({message: 'We need a new_password and confirm_new_password attributes'})
        }

        if(new_password !== confirm_new_password){
            return res.status(400).json({message: 'Passwords do not match'});
        }

        let payload;
        try{
            payload = jwt.verify(token, process.env.HASH_BCRYPT); //se o token for valido, ele vai para o payload
        }catch(err){
            console.log("failed", err);
            return res.status(401).json({message: "Invalid or expired token"});
        }

        const user = await Users.findOne({
            where: {
                id: payload.id
            }
        })

        if(!user){
            return res.status(404).json({message: "User not found" });
        }
       
        user.password = new_password;
        await user.save();

        return res.status(200).json({message: 'Password updated succesfully'});
    }
}

module.exports = new PasswordController();