const jwt = require('jsonwebtoken')
const {promisify} = require('util')

const decryptedToken = async (authHeader) => {
    const [,token] = authHeader.split(' '); //o authHEader vem neste formato: {"Bearer nsjughweiungkejbgk"} assim, ele pega só a segunda parte

    return promisify(jwt.verify)(token, process.env.HASH_BCRYPT);
}

module.exports = {decryptedToken};