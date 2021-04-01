
module.exports = function idval(req,res,next){
    
    
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).send('Genre not found in our list')
      }
    next();

    }