const express = require('express');
const app = express();
const winston = require('winston')
const bodyParser = require('body-parser')





app.use(express.static('public'));
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('vievs','./views');

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","x-auth-token,Origin,content-type");
    res.header("Access-Control-Allow-Methods","GET,PUT,PATCH,POST,DELETE,OPTIONS");
    next()
})




require('./startup/winston')();
require('./startup/routes')(app)
require('./startup/mongoose')()
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app);

const port = process.env.PORT || 5000
const server = app.listen(port,()=>winston.info(`listening on port ${port}`))

module.exports = server
     