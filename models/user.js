const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    isAdmin:Boolean
    })

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id,isAdmin: this.isAdmin,name:this.name}, config.get('jwtPrivateKey')  );
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User

