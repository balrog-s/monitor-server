var db = require('../db');

const insertEvent = (event) => {
    return db('events')
    .insert(event)
    .returning('*');
}

const getLastEventForUser = userId => {
    return db('status_events')
    .first('*')
    .where('user_id', userId)
    .orderBy('created_at', 'desc')
}

const getEventsForUser = (userId, offset, limit) => {
    return db('status_events')
    .select('*')
    .where('user_id', userId)
    .offset(offset)
    .limit(limit)
    .orderBy('created_at', 'desc')
}

module.exports = {
    insertEvent,
    getLastEventForUser,
    getEventsForUser,
};
