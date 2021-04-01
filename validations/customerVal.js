const joi = require('joi')



function CustomerValidation (customer) {
    const  schema = joi.object({
       isGold: joi.boolean().required(), 
       name: joi.string().min(5).required(),
       phone: joi.string().required()
     })
   return schema.validate(customer)
 }








module.exports = CustomerValidation