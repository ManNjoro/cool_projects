const mongoose = require('mongoose')
const Joi = require("joi");
const express = require("express");
const app = express();
const genres = require('./routes/genres')
const movies = require('./routes/movies')

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to mongodb...'))
    .catch((err) => console.error('Could not connect to mongodb'))

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/movies', movies)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}...`))