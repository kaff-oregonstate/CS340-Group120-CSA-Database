const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit:    10,
    host:               'classmysql.engr.oregonstate.edu',
    user:               'cs340_kaffs',
    password:           'sP6ptfbWuXAU54w',
    database:           'cs340_kaffs'
});
module.exports.pool = pool;