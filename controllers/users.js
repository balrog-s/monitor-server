const userRepo = require('../repositories/users');
const userSchema = require('../validation/users');

const registerUser = (req, res, next) => {
    const user = req.body;
    const { error, value } = userSchema.validate(user);
    if (error) {
        console.log('Validation Error: ', {error});
        res.send(400, {error});
        return next();
    }
    return userRepo.insertUser(value)
    .then(user => {
        console.log('Registered new user: ', {user});
        res.status(200).send({user});
        return next();
    });
}

module.exports = {
    registerUser
}