 
const express = require('express');
const router = express.Router();
const Rental = require('../models/rental')
const Movie = require('../models/movie')
const auth = require('../middleware/auth')
const moment = require('moment')
const joi = require('joi')
const validate = require('../middleware/return')


 

 router.post('/',[auth,validate(validateReturn)],async(req,res)=>{
    const rental = await Rental.lookup(req.body.customerId,req.body.movieId)

    
    if(!rental)return res.status(404).send('rental not found');

    if(rental.dateReturned != undefined){return res.send(400)}
  
   rental.return();

    
    await rental.save();
   
    await Movie.update({ _id:rental.movie._id},{$inc:{numberInStock:1}})

   

    return res.status(200).send(rental)
 });
   function validateReturn(req) {
    const schema = joi.object({
        customerId: joi.objectId().required(),
        movieId:joi.objectId().required()
    })
     return schema.validate(req)
   
   }


 module.exports = router;