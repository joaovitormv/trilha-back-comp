const Users = require ('../models/users');

async function AdmMiddleware(req, res, next){
    const user = await Users.findOne({
        where:{id: req.userId}
    })

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    if (!user.is_admin) {
        return res.status(403).json({ message: "Forbidden: Requires admin access" });
    }

    return next();
}

module.exports = AdmMiddleware;