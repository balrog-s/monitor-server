var db = require('../db');
var {uuid} = require('uuidv4');

const insertUser = user => {
    const id = uuid();
    const username = user.username;
    const password = user.password;
    return db('users')
    .insert({
        id,
        username,
        password
    })
    .returning('*')
    .then(user => user[0]);
}

const getUserByUsername = username => {
    return db('users')
    .first(['id', 'username', 'password'])
    .where('username', username);
}

module.exports = {
    insertUser,
    getUserByUsername,
};
