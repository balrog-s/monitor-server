const eventLogger = require('./eventLogger');
var {uuid} = require('uuidv4');
var jwt = require('jsonwebtoken');
const R = require('ramda');

const privateKey = process.env.privateKey || 'foobar';

const checkIn = (req, res, next) => {
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
        console.log(lastEvent);
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
        return eventLogger.logEvent(eventType, data).then(event => {
            res.status(200).send(event);
            return next();
        });
    });
}

module.exports = {
    checkIn
}