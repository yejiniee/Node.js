const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'yejin-db.cvucmt5wxj2m.ap-northeast-2.rds.amazonaws.com', //rds endpoint
    user: 'root', //rds 유저이름
    port: '3306',
    password: 'whdpwls12',
    database: 'UdemyServer' //db이름
});

module.exports = {
    pool: pool
};