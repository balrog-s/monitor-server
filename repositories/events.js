var db = require('../db');

const insertEvent = (event) => {
    return db('events')
    .insert(event)
    .returning('*');
}

module.exports = {
    insertEvent,
};
