
const Rental = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest')
const User = require('../../models/user')
const moment = require('moment')
const Movie = require('../../models/movie')

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let id;
    let movie;


    const exec = async () => {
        return await request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        token = token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'Pirates of Carribean',
            genre: { genre: 'Sci-fiy' },
            dailyRentalRate: 2,
            numberInStock: 10
        })
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Adamko',
                phone: '0917022134'
            },
            movie: {
                _id: movieId,
                title: 'Pirates of Carribean',
                dailyRentalRate: 2
            },

        });
        await rental.save()
        id = rental._id
    })
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    })
    it('should return 400 if customerId not provided', async () => {
        customerId = '';
  
        const res = await exec()

        expect(res.status).toBe(400)
    })
    it('should return 401 if client not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401)
    })
    it('should return 400 if movieId not provided', async () => {
        movieId = '';

        const res = await exec()
        expect(res.status).toBe(400)
    });
    it('should return 404 if no rental found', async () => {
        await Rental.remove({})

        const res = await exec();

        expect(res.status).toBe(404)
    })
    it('should return 400 if proccessed', async () => {


        rental.dateReturned = new Date()
        await rental.save()
        console.log(await Rental.findById(id))

        const res = await exec()
        expect(res.status).toBe(400)


    })
    it('should return 200 if valid request', async () => {

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned
        expect(diff).toBeLessThan(10 * 1000)

    })
    it('should return a rental fee', async () => {

        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(14);

    })
    it('should increase the movie stock', async () => {

 

        const res = await exec();

        const movieInDb = await Movie.findById(movieId)
        console.log(movieInDb.numberInStock) 
        expect(movieInDb.numberInStock).toBe(11); 

    });
    it('should return the rental if input is validd', async () => {

   

        const res = await exec();
        rentalInDb = await Rental.findById(rental._id) 

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie','_id','__v']))
    }) 
})     