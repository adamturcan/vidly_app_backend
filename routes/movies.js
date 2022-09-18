const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const MovieApp = express.Router();
const Movie = require("../models/movie");
const Genre = require("../models/genre");
const MovieValidation = require("../validations/movieVal");

MovieApp.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

MovieApp.post("/", auth, async (req, res) => {
  const { error } = MovieValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Genre not found in our list");

  let movie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    info: req.body.info,
  });
  movie = await movie.save();
  res.send(movie);
});

MovieApp.get("/:id", async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).send("Movie not found in our list");
  }
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found in our list");

  res.send(movie);
});

MovieApp.put("/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).send("Movie not found in our list");
  }
  const { error } = MovieValidation(req.body);
  if (error) return res.status(400).status(error.details[0].status);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Genre not found in our list");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      info: req.body.info,
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("Movie not found in our list");

  res.send(movie);
});

MovieApp.delete("/:id", [auth, admin], async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).send("Movie not found in our list :(");
  }

  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    return res.status(404).send("Movie not found in our list :(");
  }

  res.send(movie);
});

module.exports = MovieApp;
