const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const { genreSchema } = require("./genres");
const router = express.Router();

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: genreSchema,
  numberInStock: Number,
  dailyRentalRate: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

// deleteGenre('67952c648b5a89d91f99a1b6')

function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(genre);
}
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.object({
      name: Joi.string().required(),
    }),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });
  return schema.validate(movie);
}

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    numberInstock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInstock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
