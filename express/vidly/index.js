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

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
