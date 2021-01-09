'use strict'

const validator = require('validator');
const Article = require('../models/article');
const fs = require ('fs');
const path = require('path');


var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;
    
        return res.status(200).send({
            "curso": "master en frameworks JS",
            "alumno": "Felipe Espinoza B",
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controllador de articulos'
        });
    },
    
    //Método para guardar los articulos
    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        console.log(params);

        // Validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_title && validate_content){
            // Crear objeto a guardar
            let article = new Article();
        
            // Asignar valores
            article.title   = params.title;
            article.content = params.content;  
            article.image   = null;
            
            // Guardar el articulo
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El articulo no se ha guardado !'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos :('
            });
        }
        
    },

    // Obtener todos los articulos
    getArticles: (req, res) => {

        //  Obtener los ultimos 5 articulos
        var query = Article.find({});
        var last = req.params.last;
        console.log(last);

        if(last || last != undefined){
            query.limit(5);
        }

        // Find
        // En el sort si le paso el id los ordena ascendentes (del más antiguo al más nuevo)
        // Si en el sort le paso -_id los ordena decendentes (del más nuevo al más antiguo)
        query.find({}).sort('-_id').exec((err, articles) => {
            
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    // Obtener un articulo en concreto
    getArticle: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;
        // Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'no existe el artículo'
            });
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if(err || !Article){
                return res.status(404).send({
                    status: 'error',
                    message: 'no existe el artículo'
                });
            }

            // Devolverlo en json

            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    // Método para actualizar un articulo
    update: (req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;
          
        // Recoger los datos que llegan por PUT
        var params = req.body;

        // Validar datos
        try{
            var validate_title = !validator.isEmpty(req.body.title);
            var validate_content = !validator.isEmpty(req.body.content);

            if(validate_title && validate_content){
                
                // Find and update
                Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'No se pudo actualizar el articulo :('
                        });
                    }
                    
                    if(!articleUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el articulo !'
                        });
                    }

                    // Devolver respuesta
                    return res.status(200).send({
                        status: 'success',
                        articleUpdated
                    });
                    

                });
            }
        }catch(err){
            return res.status(400).send({
                status: 'error',
                message: 'Datos ingresados incompletos'
            })
        }
    },

    delete: (req, res) => {
        // Capturar el id por la url
        var articleId = req.params.id;

        if(articleId == '' || articleId ==null){
            return res.status(400).send({
                status: 'error',
                message: 'El id ingresado no es válido'
            });
        }
        

        // Find and delete
        Article.findByIdAndDelete(articleId, (err, articleDeleted) => {
            if(err){
                return res.status(400).send({
                    status: 'error',
                    message: 'no se pudo eliminar el articulo'
                });
            }

            if(!articleDeleted){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se pudo eliminar el articulo, puede que no exista :('
                });
            }

            // Devolver respuesta
            return res.status(200).send({
                status: 'success',
                mesage: 'El articulo se elimino correctamente',
                article: articleDeleted
            });
        });
    },

    // Subida de archivos
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger fichero de la petición
        var file_name = 'imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: fileName
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extensión, solo imagenes, si es valida borrar el fichero

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            });

        }else{
            // Si todo es válido
            var articleId = req.params.id;
            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                if(!articleUpdated){
                    return res.status(400).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo'
                    });
                }
                
                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });
            });


        }

    }, // End upload file

    // Método sacar imagen
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        // Comprobar si el archivo existe
        fs.stat(path_file, (stats) => {
            if(stats){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req,res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;
        // Find or
        Article.find({ '$or': [
            // Si el search string está incluido dentro del title o dentro del content, envía todos los articulos que coincidan con esa busqueda
            {'title': {'$regex': searchString, '$options': 'i'}},
            {'content': {'$regex': searchString, '$options': 'i'}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        })

    }   


}; // End controller

module.exports = controller;