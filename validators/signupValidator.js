const Joi = require('joi');

const signupSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age:Joi.number().required(),
    gender:Joi.string().min(3).required(),
});

module.exports = signupSchema;
