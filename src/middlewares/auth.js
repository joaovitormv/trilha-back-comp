const {decryptedToken} = require('../utils/token')
const {decrypt} = require('../utils/crypt')

const verifyJwt = async (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: 'Unset Token!'});
    }

    try {
        const payload = await decryptedToken(authHeader);
        const encryptedIdObject = payload.encryptedData;
        const realId = decrypt(encryptedIdObject);
        req.userId = parseInt(realId);
        return next();
    } catch (error) {
        console.error("FALHA NO AUTH MIDDLEWARE:", error.message); 
        
        return res.status(401).json({ message: 'Unauthorized: Error during token validation' });
    }
}


module.exports = verifyJwt;