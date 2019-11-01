import Koa from 'koa';
import logUtil from'./utils/log_util';
import json from'koa-json';
import convert from'koa-convert';
import onerror from'koa-onerror';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import cors from 'koa2-cors';
import jwt from 'koa-jwt';
import {verify,SECRET} from './utils/auth';


import user from'./routes/user';

const app = new Koa();
onerror(app);
// middlewares
app.use(koaBody());
app.use(cors({
    // origin: function (ctx) {
    //     return ['http://localhost:8000','http://106.14.210.21:8080']; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    //     // return 'http://106.14.210.21:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    // },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
})); //使用cors
app.use(json());
app.use(convert(logger()));
// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    let ms;
    try {
        //开始进入到下一个中间件
        await next();
        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});

/***
 * 权限验证模块--------------------------------->
 * **/
app.use(async (ctx, next) => {
    if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
            //取出token
            const scheme = parts[0];
            const token = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                try {
                    let payload = await verify(token);
                    console.info(`payload:${JSON.stringify(payload)}`);
                } catch (error) {
                    console.info(error);
                }
            }
        }
    }
    return next().catch(err => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body ='未授权，访问被拒绝';
        } else {
            throw err;
        }});
});
app.use(jwt({secret: SECRET}).unless({path: [/\/login/]}));
/***
 * 权限验证模块--------------------------------->
 * **/
/***
 * 路由配置模块--------------------------------->
 * ***/
app.use(user.routes());
/***
 * 路由配置模块--------------------------------->
 * ***/
app.use(user.allowedMethods());

module.exports =  app;
