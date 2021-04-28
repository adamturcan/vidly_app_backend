const joi = require('joi')
function GenreValidation(zaner) {
    const schema = joi.object({
        name: joi.string().min(5).max(50).required()
    })
     return schema.validate(zaner)
   
   }

module.exports = GenreValidation