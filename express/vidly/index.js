const winston = require('winston')
const express = require("express");
const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;


const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
winston.add(new winston.transports.Console({
  handleExceptions: true,
  handleRejections: true
}))

module.exports = server