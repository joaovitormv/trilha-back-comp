const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/userController')
const schemaValidator = require('./middlewares/schemaValidator')
const useSchema = require("./schema/createUserSchema.json")
const authSchema = require('./schema/authSchema.json')
const AuthController = require('./controllers/authController');
const AuthMiddleware = require('./middlewares/auth');


routes.get('/', async (req, res)=>{
    res.send("Tudo ok")
})

routes.post('/user', schemaValidator(useSchema), UserController.create);

routes.post('/auth', schemaValidator(authSchema), AuthController.auth);

routes.put('/user', AuthMiddleware, UserController.update);

routes.use(AuthMiddleware);

routes.get('/check', (req, res) => {
    return res.send({message: "Connected with success"})
})

module.exports = routes;