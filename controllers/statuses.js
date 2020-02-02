const eventsRepo = require('../repositories/events');
const userRepo = require('../repositories/users');
var jwt = require('jsonwebtoken');
const R = require('ramda');

const privateKey = process.env.privateKey || 'foobar';

//TODO: Move this fn to a utility file or part of route chain prior to hitting controller code
const getUserFromToken = req => {
    const token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.verify(token, privateKey);
    const user = R.omit(['iat'], decodedToken);
    return user;
}

//TODO: Move parameter checks to a separate service file
const newStatus = (req, res, next) => {
    const user = getUserFromToken(req);
    let eventType;
    if (req.body["type"] === 'checkin') {
        eventType = 'USER_CHECKED_IN';
    } else if (req.body["type"] === 'checkout'){
        eventType = "USER_CHECKED_OUT";
    } else {
        res.status(400).send("Invalid status type");
        return next();
    }
    return eventsRepo.getLastEventForUser(user.id)
    .then(lastEvent => {
        if (lastEvent === undefined) {
            res.status(404).send("No user activity found.");
            return next();
        }
        else if (lastEvent.event_type === 'USER_CHECKED_IN') {
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
        return eventsRepo.insertEvent(eventType, user)
        .then(event => {
            res.status(200).send(event);
            return next();
        })
        .catch(err => {
            res.status(500).send({error: err});
            return next();
        });
    });
}

const getStatusHistoryForUser = (req, res, next) => {
    const user = getUserFromToken(req);
    const offset = req.query.offset;
    const limit = req.query.limit;
    if (user.id !== req.params.user_id) {
        res.status(403).send("You are not authorized to view this.");
    }
    return eventsRepo.getEventsForUser(req.params.user_id, offset, limit)
    .then(events => {
        res.status(200).send({events: events});
        return next();
    })
    .catch(err => {
        res.status(500).send({error: err});
        return next();
    });
}

const getStatusHistoryForAllUsers = (req, res, next) => {
    const user = getUserFromToken(req);
    const offset = req.query.offset;
    const limit = req.query.limit;
    return userRepo.getUserByUserId(user.id)
    .then(user => {
        if (!user) {
            res.status(403).send("You are not authorized to view this.");
        }
        return user;
    })
    .then(() => eventsRepo.getEventsForAllUsers(offset, limit))
    .then(events => {
        res.status(200).send({events: events});
        return next();
    })
    .catch(err => {
        res.status(500).send({error: err});
        return next();
    });
}

module.exports = {
    newStatus,
    getStatusHistoryForUser,
    getStatusHistoryForAllUsers,
}