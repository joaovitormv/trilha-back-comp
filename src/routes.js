const {Router} = require('express');
const routes = new Router();
const UserModel = require('./models/users');

routes.get('/', async (req, res)=>{
    res.send("Tudo ok")
})

routes.get('/users', async (req, res)=>{
    const allUsers = await UserModel.findAll();
    res.send({Users: allUsers})
})

routes.get('/health', (req, res) => {
    return res.send({message: "Connected with success"})
})


module.exports = routes;