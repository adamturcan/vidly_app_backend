const express = require('express');
const mongoose = require('mongoose');
const RentalValidation = require('../validations/rentalVal')
const Rental = require('../models/rental')
const RentalApp = express.Router();
const Movie = require('../models/movie');
const Customer = require('../models/customer');
const Fawn = require('fawn')


Fawn.init(mongoose);


RentalApp.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals)
})

RentalApp.post('/', async (req, res) => {

    const { error } = RentalValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Movie not found in oure list');

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('Customer not found in our list :(')

    if (movie.numberInStock == 0) return res.status(400).send('No more movies in stock')

    let rental = new Rental({

        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    })
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental)
    }
    catch (ex) {
        res.status(500).send('soimething failed')
    }
});

RentalApp.delete('/:id', async (req, res) => {

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send('no such rental found :(')
    }
    let rental = await Rental.findByIdAndRemove(req.params.id)

    let movie = await Movie.findById(rental.movie._id)



    movie.numberInStock++;
    movie = movie.save()

    res.send(rental.save())


})



RentalApp.get("/:id", async (req, res) => {

    if (!req.params.id.match(/^[0-9a-zA-Z]{24}$/)) {
        return res.status(404).send('no such rental found')
    }

    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).send('no such rental found :(')

    res.send(rental)


})





module.exports = RentalApp