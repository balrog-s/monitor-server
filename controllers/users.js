const userRepo = require('../repositories/users');
const eventsRepo = require('../repositories/events');
const userSchema = require('../validation/users');
const hash = require('password-hash');
const jwt = require('jsonwebtoken');
const R = require('ramda');

const privateKey = process.env.privateKey || 'foobar';

const registerUser = (req, res, next) => {
    const user = {
        username: req.body.username,
        password: hash.generate(req.body.password)
    };

    const { error, value } = userSchema.validate(user);

    if (error) {
        console.log('Validation Error: ', {error});
        res.status(400).send({error});
        return next();
    }
    return userRepo.insertUser(value)
    .then(user => {
        console.log('Registered new user: ', {user});
        res.status(200).send({user});
        return user;
    })
    .then(user => eventsRepo.insertEvent('USER_REGISTERED', user))
    .then(next);
}

const loginUser = (req, res, next) => {
    const userCredentials = req.body;
    return userRepo.getUserByUsername(userCredentials.username)
    .then(user => {
        if (hash.verify(userCredentials.password, user.password)) {
            const token = jwt.sign(R.omit(['password'], user), privateKey);
            res.status(200).send({token});
            return eventsRepo.insertEvent('USER_LOGGED_IN', R.omit(['password'], user));
        } else {
            res.status(404);
            return userCredentials;
        }
    })
    .then(next);
}

module.exports = {
    registerUser,
    loginUser
}