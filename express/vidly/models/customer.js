const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  isGold: Boolean,
  phone: {
    type: String,
    minLength: 10,
  }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(10)
  });
  return schema.validate(Customer);
}
exports.customerSchema = customerSchema;
exports.Customer = Customer; 
exports.validate = validateCustomer;