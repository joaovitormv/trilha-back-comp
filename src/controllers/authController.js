const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { encrypt } = require('../utils/crypt')

class AuthController {

    async auth(req, res) {
        const { email, user_name, password } = req.body;

        // Define critério de busca (email ou username) e valida existência dos campos
        let whereClause = {}
        if (email) {
            whereClause.email = email;
        } else if (user_name) {
            whereClause.user_name = user_name;
        } else {
            return res.status(401).json({ error: "We need a email or password >:(" });
        }

        // Busca o usuário no banco e verifica se existe
        const user = await Users.findOne({
            where: whereClause,
        })
        if (!user)
            return res.status(401).json({ error: "User not found! :(" });

        // Valida a senha utilizando o método do Model
        if (!await user.checkPassword(password)) {
            return res.status(401).json({ error: "Password does not match" })
        }

        const { id, user_name: userName } = user;

        // Criptografa o ID e gera o token JW
        const encryptedPayload = encrypt(id);



        const token = jwt.sign(
            { encryptedData: encryptedPayload },
            process.env.HASH_BCRYPT,
            { expiresIn: '7d' }
        );
        return res.status(200).json({ user: { id, user_name: userName }, token: token });
    }
}

module.exports = new AuthController();