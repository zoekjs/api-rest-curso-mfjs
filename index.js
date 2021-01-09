'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
//uso de promesas con mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true})
    .then(() => {
        console.log('La conexión con la base de datos se ha realizado correcta :)');

        //Crear servidor y ponerme a escuchar peticiones Http
        app.listen(port, () => {
            console.log('servidor corriendo en http://localhost:'+port);
        });
    });