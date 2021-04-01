const joi = require('joi');



function RentalValidation(rental) {
const Schema = joi.object({
    customerId: joi.objectId().required(),
    movieId: joi.objectId().required()
})
 
return Schema.validate(rental)


}




module.exports = RentalValidation;