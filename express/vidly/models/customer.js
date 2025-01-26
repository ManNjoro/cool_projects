const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  isGold: {
    type: Boolean,
    default: false
},
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 50
  }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(10).required()
  });
  return schema.validate(customer);
}
exports.customerSchema = customerSchema;
exports.Customer = Customer; 
exports.validate = validateCustomer;