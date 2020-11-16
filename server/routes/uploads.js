const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// manejo de archivos
const fs = require('fs');
// crear el path de la ruta deseada
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: 'no se ha seleccionado ningun archivo'
            })
    }

    // validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: 'el tipo enviado no es valido, tipos validos ' + tiposValidos.join(' '),
                tipo
            })
    }


    // captura el dato del archivo en cuestion enviado en el parametro archivo
    let archivo = req.files.archivo;

    // extensiones validas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: 'la extensiones permitidas son ' + extensionesValidas.join(' '),
                ext: extension
            })
    }

    // crea el nombre del archivo cargado
    let newNombre = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // guardo en el path deseado
    archivo.mv(`uploads/${tipo}/${newNombre}`, (err) => {
        if (err) {
            borrArchivo(newNombre, tipo);
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        switch (tipo) {
            case 'productos':
                imagenProducto(id, res, newNombre);
                break;

            case 'usuarios':
                imagenUsuario(id, res, newNombre);
                break;
            default:
                break;
        }


    });
})

function imagenUsuario(id, res, nombre) {
    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borrArchivo(nombre, 'usuarios');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!usuarioBD) {
            borrArchivo(nombre, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            });
        }

        // borra el archivo
        borrArchivo(usuarioBD.img, 'usuarios');
        usuarioBD.img = nombre;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuarioGuardado,
                img: nombre
            })
        })


    })
}

function imagenProducto(id, res, nombre) {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrArchivo(nombre, 'productos');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!productoDB) {
            borrArchivo(nombre, 'productos');
            return res.status(400).json({
                ok: false,
                err: 'producto no encontrado'
            });
        }

        // borra el archivo
        borrArchivo(productoDB.img, 'productos');
        productoDB.img = nombre;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado,
                img: nombre
            })
        })


    })
}


function borrArchivo(nombre, tipo) {
    // / crea la ruta d ela img
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombre}`);
    // console.log(pathImg);
    // valida si la imagen existe
    if (fs.existsSync(pathImg)) {
        // borra la imagen si existe
        fs.unlinkSync(pathImg);

    }
}

module.exports = app;