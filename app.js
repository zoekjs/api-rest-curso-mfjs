//Crear servidor web con Node
'use strict'

//Cargar modulos de node para crear servidor
const express = require('express');
const bodyParser = require('body-parser');


// Ejecutar express
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article');

// Middlewares
// Utiliza body parser
app.use(bodyParser.urlencoded({extended: false}));
// Convierte cualquier petición en un JSON
app.use(bodyParser.json());

// CORS acceso cruzado entre dominios
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Añadir prefijos a rutas
app.use('/api', article_routes);

// Ruta o método de prueba para la API REST



// Exportar modulo (fichero actual)
module.exports = app;