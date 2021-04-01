const joi = require('joi')


function MovieValidation (movie){
    const Schema = joi.object({
     title: joi.string().required().min(3),
     genreId: joi.objectId().required(),
     numberInStock: joi.number().required(),
     dailyRentalRate: joi.number().required()
     
    })
    return Schema.validate(movie)
    
    }
    
    module.exports = MovieValidation;