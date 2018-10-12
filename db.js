import MySQL from 'mysql';

/**
 * Database conneciton info
 * User 'info3130' has extremely limited permissions, don't even bother trying to connect
 */
const connection = MySQL.createConnection({
    host: '159.89.117.207',
    user: 'info3130',
    password: 'R7W9Jaax!',
    database: 'pw_info3130_a3'
});

/**
 * Connect to the database
 * @param {string} err - Potential error
 */
connection.connect((err) => {
    let msg = 'MySQL Database ' + (err == null ? 'connected' : 'error: ' + err);
    console.log(msg);
});

exports.DB = connection;
exports.MySQL = MySQL;
console.log('db.js loaded successfully');
