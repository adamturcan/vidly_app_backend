const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const express = require('express')
const genres = express.Router();
const Genre = require('../models/genre')
const GenreValidation= require('../validations/genreVal')
const idval = require('../middleware/idValidation')
const validate = require('../middleware/return')
//const asyncMiddleware = require('../middleware/async')


genres.get('/',async (req,res)=>{
  //  throw new Error('Could not get the genres.');
    const genres  = await Genre.find();
    res.send(genres); 

});

genres.get('/:id',idval,async(req,res)=>{
  

const genre  = await Genre.findById(req.params.id)


if(!genre) return res.status(404).send('Genre not found in our list')

res.send(genre)
})

genres.post('/',[auth,validate(GenreValidation)],async(req,res)=>{

    let genre = new Genre ( {
     name: req.body.name
    })
    genre = genre.save()
    res.send(await genre)
});

genres.put('/:id',[auth,validate(GenreValidation)],async (req,res)=>{
    

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).send('Genre not found in our list')
  }
    
  const genre = await Genre.findByIdAndUpdate(req.params.id,{genre:req.body.name},{new:true})
   

  if(!genre) return res.status(404).send('Genre not found in our list')

  res.send(genre)

})

genres.delete('/:id',[auth,admin],async(req,res)=>{

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).send('Genre not found in our list')
  }

    const genre = await Genre.findByIdAndRemove(req.params.id)
 
    if(!genre) return res.status(404).send('Genre not found in our list')

    res.send(genre)

})


module.exports = genres