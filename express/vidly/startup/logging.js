const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')

module.exports = function() {
    winston.add(new winston.transports.File({
        filename: 'uncaughtExceptions.log',
        level: 'error',
        handleExceptions: true,
        handleRejections: true
      }))
      
      
      winston.add(new winston.transports.File({filename: 'logfile.log'}))
      // winston.configure({
      //   transports: [new winston.transports.File({filename: 'logfile.log'})],
      //   format: winston.format.combine(
      //     winston.format.timestamp(),
      //     winston.format.json()
      //   )
      // })
      winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}))
}