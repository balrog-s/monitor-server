const db = require('../db');
const {uuid} = require('uuidv4');

const insertUser = user => {
    const id = uuid();
    const username = user.username;
    const password = user.password;
    const first_name = user.first_name;
    const last_name = user.last_name;
    return db('users')
    .insert({
        id,
        username,
        password,
        first_name,
        last_name
    })
    .returning('*')
    .then(user => user[0]);
}

const getUserByUsername = username => {
    return db('users')
    .first(['id', 'username', 'first_name', 'last_name', 'password'])
    .where('username', username);
}

const getUserByUserId = userId => {
    return db('users')
    .first(['id', 'username', 'first_name', 'last_name'])
    .where('id', userId);
}

module.exports = {
    insertUser,
    getUserByUsername,
    getUserByUserId,
};
