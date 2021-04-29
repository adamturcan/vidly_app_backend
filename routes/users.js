 const bcrypt = require('bcrypt')
 const _ = require('lodash')
 const express = require('express');
 const UserApi = express.Router();
const User = require('../models/user')
const userValidation = require('../validations/userVal')
const auth = require('../middleware/auth')

UserApi.get('/me',auth, async ( req, res)=>{
  console.log('haha')
const user = await User.findById(req.user._id).select('-password')
res.send(user)
})
UserApi.put('/me',auth, async ( req, res)=>{
  console.log('haha')
let currentUser = req.body

let user = await User.findById(req.user._id)

user.liked = currentUser.liked

await user.save()

console.log(user)
res.send(user)

})





 UserApi.post('/',async(req,res)=>{
      console.log(req)

    const {error} = userValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("User already registered")



   user = new User(_.pick(req.body,["name",'email','password','liked']))
   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(user.password,salt)
    await user.save();  

    
    const token = user.generateAuthToken()

    res.header('x-auth-token',token).header("access-control-expose-headers","x-auth-token").send(_.pick(user,['_id','name','email']))

 })




 module.exports = UserApi; 