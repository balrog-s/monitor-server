const db = require('../db');
const {uuid} = require('uuidv4');

const insertEvent = (eventType, data) => {
    const event = {
        id: uuid(),
        event_type: eventType,
        data
    };
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

const getEventsForAllUsers = (offset, limit) => {
    return db('status_events')
    .select('*')
    .offset(offset)
    .limit(limit)
    .orderBy('created_at', 'desc');
}

module.exports = {
    insertEvent,
    getLastEventForUser,
    getEventsForUser,
    getEventsForAllUsers,
};
