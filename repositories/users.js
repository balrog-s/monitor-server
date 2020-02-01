var db = require('../db');
var {uuid} = require('uuidv4');
var hash = require('password-hash');

const insertUser = user => {
    const id = uuid();
    const password = hash.generate(user.password);
    const username = user.username;

    return db('users')
    .insert({
        id,
        username,
        password
    })
    .returning('*')
    .catch(() => user);
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
