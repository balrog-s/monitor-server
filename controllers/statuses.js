const eventLogger = require('./eventLogger');
var jwt = require('jsonwebtoken');
const R = require('ramda');

const privateKey = process.env.privateKey || 'foobar';

const newStatus = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.verify(token, privateKey);
    const data = R.omit(['iat'], decodedToken);
    let eventType;
    if (req.body["type"] === 'checkin') {
        eventType = 'USER_CHECKED_IN';
    } else if (req.body["type"] === 'checkout'){
        eventType = "USER_CHECKED_OUT";
    } else {
        res.status(400).send("Invalid status type");
        return next();
    }
    return eventLogger.getLastEventForUser(data.id)
    .then(lastEvent => {
        if (lastEvent.event_type === 'USER_CHECKED_IN') {
            if (eventType !== 'USER_CHECKED_OUT') {
                res.status(400).send("You need to check out before you can check in again.");
                return next();
            }
        } else if (lastEvent.event_type !== 'USER_CHECKED_IN') {
            if (eventType !== 'USER_CHECKED_IN') {
                res.status(400).send("You need to check in before you can check out again.");
                return next();
            }
        }
        return eventLogger.logEvent(eventType, data)
        .then(event => {
            res.status(200).send(event);
            return next();
        });
    });
}

const getStatusHistoryForUser = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.verify(token, privateKey);
    const data = R.omit(['iat'], decodedToken);
    const offset = req.query.offset;
    const limit = req.query.limit;
    if (data.id !== req.params.user_id) {
        res.status(403).send("You are not authorized to view this.");
    }
    return eventLogger.getEventsForUser(req.params.user_id, offset, limit)
    .then(events => {
        res.status(200).send({events: events});
        return next();
    })
}

module.exports = {
    newStatus,
    getStatusHistoryForUser,
}