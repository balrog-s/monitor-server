const eventLogger = require('./eventLogger');
var {uuid} = require('uuidv4');
var jwt = require('jsonwebtoken');
const R = require('ramda');

const privateKey = process.env.privateKey || 'foobar';

const checkIn = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    console.log('token', token);
    const decodedToken = jwt.verify(token, privateKey);
    console.log('decodedToken', decodedToken);
    const data = R.omit(['iat'], decodedToken);
    console.log('data', data);
    return eventLogger.logEvent({
        id: uuid(),
        event_type: 'USER_CHECKED_IN',
        data
    }).then(event => {
        res.status(200).send(event);
        return next();
    });
}

module.exports = {
    checkIn
}