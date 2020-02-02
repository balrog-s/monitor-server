var {uuid} = require('uuidv4');
var eventsRepo = require('../repositories/events');

const logEvent = (eventType, data) => {
    const event = {
        id: uuid(),
        event_type: eventType,
        data
    };
    return eventsRepo.insertEvent(event);
}

const getLastEventForUser = userId => {
    return eventsRepo.getLastEventForUser(userId);
}

const getEventsForUser = (userId, offset, limit) => {
    return eventsRepo.getEventsForUser(userId, offset, limit);
}

const getEventsForAllUsers = (offset, limit) => {
    return eventsRepo.getEventsForAllUsers(offset, limit);
}

module.exports = {
    logEvent,
    getLastEventForUser,
    getEventsForUser,
    getEventsForAllUsers,
}