const genres = require('../routes/genres')
const home = require('../routes/home')
const CustomerApp = require('../routes/customers')
const MovieApp = require('../routes/movies')
const RentalApp = require('../routes/rentals')
const UserApi = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middleware/error')
const express = require('express');
const morgan = require('morgan')
const returns = require('../routes/returns')


module.exports = function(app){
    app.use(express.urlencoded({extended:true}))
    app.use(express.json())
    app.use('/api/genres',genres)
    app.use('/',home)
    app.use('/api/customers',CustomerApp)
    app.use('/api/movies',MovieApp)
    app.use('/api/rentals',RentalApp)
    app.use('/api/users',UserApi)
    app.use('/api/auth',auth)
    app.use('/api/returns',returns)
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
    app.use(error)

}