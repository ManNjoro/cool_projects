require('express-async-errors')
const config = require('config')
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals")
const users = require("./routes/users")
const auth = require("./routes/auth");
const error = require('./middleware/error');

if (!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("Could not connect to mongodb"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

// Expres error middleware placed at the end after all middlewares
app.use(error)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
