const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express');
const UserApi = express.Router();
const User = require('../models/user')
const joi = require('joi')


UserApi.post('/',async(req,res)=>{

   const {error} = validate(req.body)
   if(error) return res.status(400).send(error.details[0].message)
   
   let user = await User.findOne({email:req.body.email});
   if(!user) return res.status(400).send("Invalid Email")

    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send("Invalid Password")


    const token = user.generateAuthToken();
    res.send(token)

})



function validate(req){
const Schema = joi.object({
email: joi.string().required().email(),
password: joi.string().required()
})

return Schema.validate(req)

}

module.exports = UserApi; 