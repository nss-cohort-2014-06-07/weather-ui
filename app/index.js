/* jshint camelcase:false */

'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  res.render('form');
});

app.post('/', function(req, res){
  var url = 'http://api.wunderground.com/api/aad218fcd659a15a/conditions/q/' + req.body.zip + '.json';
  request(url, function(error, response, forecast){
    forecast = JSON.parse(forecast);
    var temperature = forecast.current_observation.temp_f;
    var color;

    if(temperature <= 32){
      color = 'blue';
    }else if(temperature > 32 && temperature <= 70){
      color = 'green';
    }else if(temperature > 70 && temperature <= 80){
      color = 'yellow';
    }else if(temperature > 80 && temperature <= 95){
      color = 'orange';
    }else{
      color = 'red';
    }

    res.render('thermometer', {zip:req.body.zip, temperature:temperature, color:color});
  });
});

var port = process.env.PORT;

app.listen(port, function(){
  console.log('Express is now listening on PORT', port);
});

