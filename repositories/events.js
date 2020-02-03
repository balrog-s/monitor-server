const db = require('../db');
const {uuid} = require('uuidv4');

const insertEvent = (eventType, data, userId) => {
    const event = {
        id: uuid(),
        event_type: eventType,
        data,
        user_id: userId
    };
    return db('events')
    .insert(event)
    .returning('*');
}

const getLastStatusEventForUser = userId => {
    return db('events')
    .first('*')
    .where('user_id', userId)
    .whereIn('event_type', ['USER_CHECKED_IN', 'USER_CHECKED_OUT'])
    .orderBy('created_at', 'desc')
}

const getEventsForUser = (userId, offset, limit) => {
    return db('events')
    .select('*')
    .where('user_id', userId)
    .offset(offset)
    .limit(limit)
    .orderBy('created_at', 'desc')
}

const getEventsForAllUsers = (offset, limit) => {
    return db('users_history')
    .select('*')
    .offset(offset)
    .limit(limit)
    .orderBy('created_at', 'desc');
}

module.exports = {
    insertEvent,
    getLastStatusEventForUser,
    getEventsForUser,
    getEventsForAllUsers,
};
