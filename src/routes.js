const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/userController')
const schemaValidator = require('./middlewares/schemaValidator')
const useSchema = require("./schema/createUserSchema.json")

routes.get('/', async (req, res)=>{
    res.send("Tudo ok")
})

routes.post('/user', schemaValidator(useSchema), UserController.create);

routes.get('/check', (req, res) => {
    return res.send({message: "Connected with success"})
})


module.exports = routes;