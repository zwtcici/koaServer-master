import User from "../modules/user";
import {getToken} from '../utils/auth';
class userController {
    static async getList(ctx){
        let {currentPage=1, pageSize=10, username='',phone='',formDate, endDate} = ctx.query;
        let offset =(parseInt(currentPage)-1)*parseInt(pageSize);
        try{
            let data = await User.getList(offset,pageSize,username,phone,formDate, endDate);
            let dataTotal =  await User.getListCount(username,phone,formDate, endDate);
            ctx.body = {
                code: 200,
                msg: '查询成功',
                data:{
                    count:parseInt(dataTotal[0].total),
                    pageSize: parseInt(pageSize),
                    current: parseInt(currentPage),
                    rows: data
                }
            }
        }catch(err){
            console.error(err);
            ctx.body = {
                code: 412,
                msg: `接口调用异常${err.message}`
            }
        }
    }
    static async saveUser(ctx){
        let {username='',phone='',email=''} = ctx.request.body;
        try{
            await User.add(username,phone,email);
            ctx.body = {
                code: 200,
                msg: '添加成功'
            };
        }catch(err){
            console.error(err);
            ctx.body = {
                code: 412,
                msg: `接口调用异常${err.message}`
            }
        }
    }
    static async updateUser(ctx){
        let {id='',phone='',email=''} = ctx.request.body;
        try{
            await User.update(id,phone,email);
            ctx.body = {
                code: 200,
                msg: '修改成功'
            };
        }catch(err){
            console.error(err);
            ctx.body = {
                code: 412,
                msg: `接口调用异常${err.message}`
            }
        }
    }
    static async delUser(ctx){
        let {id} = ctx.request.body;
        try{
            await User.delete(id);
            ctx.body = {
                code: 200,
                msg: '删除成功'
            }
        }catch(err){
            console.error(err);
            ctx.body = {
                code: 412,
                msg: `接口调用异常${err.message}`
            }
        }
    }
    static async resetPwd(ctx){
        let {id='',password=''} = ctx.request.body;
        try{
            await User.resetPassword(id,password);
            ctx.body = {
                code: 200,
                msg: '重置成功'
            };
        }catch(err){
            console.error(err);
            ctx.body = {
                code: 412,
                msg: `接口调用异常${err.message}`
            }
        }
    }
    static async login(ctx){
        let {username='',password=''} = ctx.request.body;
        try{
            let result = await User.findByUserNameAndPwd(username,password);
            if(result && result.length > 0){
                //获取用户权限
                let token = await getToken({
                    id: result[0].id,
                    username:  result[0].username
                });
                ctx.body = {
                    code: 200,
                    msg: `登录成功`,
                    token,
                    user:{
                        username:  result[0].username,
                    }
                }
            } else {
                //失败
                ctx.body = {
                    code: 401,
                    msg: `账号密码错误`
                }
            }
        }catch(err){
            console.error(err);
            ctx.body = {
                code: 412,
                msg: `接口调用异常${err.message}`
            }
        }
    }
}
export default userController;
