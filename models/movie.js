const mongoose = require('mongoose')


const genreSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required:true,
       
    }
    
})


const Movie = mongoose.model('Movie',new mongoose.Schema({
 
    title:{type:String,required:true,minlength:3,maxlength:255},
    genre:{ type: genreSchema, required:true},
    numberInStock:{type:Number,required:true},
    dailyRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:255
    }
    
    
    
    }))

module.exports = Movie;

