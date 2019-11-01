import Router from 'koa-router';
import UserController from "../controllers/user";

const router = new Router({
    prefix: '/api'
});
router.get('/getList',UserController.getList);
router.post('/saveUser',UserController.saveUser);
router.post('/updateUser',UserController.updateUser);
router.post('/resetPwd',UserController.resetPwd);
router.post('/delUser',UserController.delUser);
router.post('/login',UserController.login);
export default router;
