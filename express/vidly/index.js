require('express-async-errors')
const winston = require('winston')
require('winston-mongodb')
const config = require('config')
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const express = require("express");
const app = express();
require('./startup/routes')(app)
require('./startup/db')()

winston.add(new winston.transports.File({
  filename: 'uncaughtExceptions.log',
  handleExceptions: true,
  handleRejections: true
}))

// process.on('uncaughtRejection', (ex) => {
//   winston.error(ex.message, ex)
//   process.exit(1)
// })

winston.add(new winston.transports.File({filename: 'logfile.log'}))
// winston.configure({
//   transports: [new winston.transports.File({filename: 'logfile.log'})],
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   )
// })
winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}))

if (!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}



const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
