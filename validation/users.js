const Joi = require('@hapi/joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string(),
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().required()
});

module.exports = schema;