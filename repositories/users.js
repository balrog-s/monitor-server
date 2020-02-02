const db = require('../db');
const {uuid} = require('uuidv4');

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

const getUserByUserId = userId => {
    return db('users')
    .first(['id', 'username'])
    .where('id', userId);
}

module.exports = {
    insertUser,
    getUserByUsername,
    getUserByUserId,
};
