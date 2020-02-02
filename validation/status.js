const Joi = require('@hapi/joi');

const schema = Joi.object({
    type: Joi.string()
        .valid('USER_CHECKED_IN', 'USER_CHECKED_OUT')
        .required(),
});

module.exports = schema;