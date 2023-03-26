const Joi = require("joi");

const authSchema = Joi.object({
    // username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
});

module.exports = authSchema;