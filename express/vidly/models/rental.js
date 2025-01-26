const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
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
    }),
    required: true
},
movie: {
    type: new mongoose.Schema({
        title:{
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 255
        },
        dailyRentalRate: { 
            type: Number, 
            required: true,
            min: 0,
            max: 255
          }
    }),
    required: true
},
dateOut: {
    type: Date,
    required: true,
    default: Date.now
},
dateReturned: {
    type: Date
},
rentalFee: {
    type: Number,
    min: 0
}
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(customer) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  });
  return schema.validate(customer);
}
exports.rentalSchema = customerSchema;
exports.Rental = Customer; 
exports.validate = validateRental;