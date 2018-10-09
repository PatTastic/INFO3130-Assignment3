import MySQL from 'mysql';

const connection = MySQL.createConnection({
    host: '159.89.117.207',
    user: 'info3130',
    password: 'R7W9Jaax!',
    database: 'pw_info3130_a3'
});

connection.connect((err) => {
    let msg = 'MySQL Database ' + (err == null ? 'connected' : 'error: ' + err);
    console.log(msg);
});

exports.DB = connection;
exports.MySQL = MySQL;
console.log('db.js loaded successfully');
