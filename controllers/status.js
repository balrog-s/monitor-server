const eventLogger = require('./eventLogger');
var {uuid} = require('uuidv4');

const privateKey = process.env.privateKey || 'foobar';

const checkIn = (req, res, next) => {
    const token = req.headers["Authorization"].split(" ")[1];
    const decodedToken = jwt.verify(token, privateKey);
    console.log(decodedToken);
    res.status(200).send({user: decodedToken});
    return eventLogger.insertEvent({
        id: uuid(),
        event_type: 'USER_CHECKED_IN',
        data: decodedToken
    }).then(event => {
        console.log(event);
        res.status(200).send(event);
        return next();
    });
}

module.exports = {
    checkIn
}