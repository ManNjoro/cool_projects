const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
   name:{
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
   },
   email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
   },
   password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
   },
   isAdmin: Boolean
  })

userSchema.methods.generateAuthToken = function() {
   const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
   return token
}

const User = mongoose.model('User', userSchema);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}


exports.User = User; 
exports.validate = validateUser;