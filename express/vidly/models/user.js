const Joi = require('joi');
const mongoose = require('mongoose');


const User = mongoose.model('User', mongoose.Schema({
 name:{
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
 },
 email: {
    type: String,
    required: true,
    unique: true
 },
 password: {
    type: String,
    required: true,
    minlength: 4,
 }
}));


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    });
    return schema.validate(user);
}


exports.User = User; 
exports.validate = validateUser;