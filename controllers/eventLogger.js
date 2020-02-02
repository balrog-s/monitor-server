var {uuid} = require('uuidv4');
var eventsRepo = require('../repositories/events');

const logEvent = (eventType, data) => {
    const event = {
        id: uuid(),
        eventType,
        data
    };
    return eventsRepo.insertEvent(event);
}

module.exports = {
    logEvent
}