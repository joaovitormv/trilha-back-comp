const {Router} = require('express');
const routes = new Router();
const UserController = require('./controllers/userController');
const PostController = require('./controllers/postController');
const LikeController = require('./controllers/likeController')
const schemaValidator = require('./middlewares/schemaValidator')
const useSchema = require("./schema/createUserSchema.json")
const authSchema = require('./schema/authSchema.json')
const AuthController = require('./controllers/authController');
const AuthMiddleware = require('./middlewares/auth');
const AdmMiddleware = require('./middlewares/admMiddleware')



routes.get('/', async (req, res)=>{
    res.send("Tudo ok")
})


routes.post('/auth', schemaValidator(authSchema), AuthController.auth);

routes.post('/user', schemaValidator(useSchema), UserController.create);
routes.put('/user', AuthMiddleware, UserController.update);
routes.delete('/user', AuthMiddleware, UserController.delete);
routes.get('/user-profile/:id', UserController.userProfile);

routes.post('/posts', AuthMiddleware, PostController.create);
routes.get('/posts', PostController.index);
routes.get('/posts/:id', PostController.show);
routes.put('/posts/:id', AuthMiddleware, PostController.update);
routes.delete('/posts/:id', AuthMiddleware, PostController.delete);

routes.post('/posts/:id/like', AuthMiddleware, LikeController.create);
routes.delete('/posts/:id/like', AuthMiddleware, LikeController.delete);

routes.delete('/admin/posts/:id', AuthMiddleware, AdmMiddleware, PostController.adminDelete);

module.exports = routes;