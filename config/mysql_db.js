const mysql=require('mysql');
// 创建一个默认配置的连接池
let localhost_pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'test',
    port: 3306,
    multipleStatements: true
});
module.exports = {
    localhost_pool
};
