const joi = require("joi");

function userValidation(user) {
  const Schema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().required().email(),
    password: joi.string().required().min(5),
    liked: joi.array(),
    isCustomer: joi.bool(),
    customerId: joi.objectId(),
    rented: joi.array(),
  });

  return Schema.validate(user);
}

module.exports = userValidation;
