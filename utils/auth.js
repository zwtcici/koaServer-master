import * as jwtSimple from 'jwt-simple';
export const SECRET='KoaServer';
export async function getToken (user) {
    let payload = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 15,
        user
    };
    let token = jwtSimple.encode(payload, SECRET);
    console.info(`生成新的token:${token}`);
    return token;
}
export async function verify (token) {
    let payload = jwtSimple.decode(token, SECRET);
    console.info(`获取payload:${JSON.stringify(payload)}`);
    return payload;
}
