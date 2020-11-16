const express = require('express');
// const fileUpload = require('express-fileupload');
let app = express();

// const Usuario = require('../models/usuario');
// const Producto = require('../models/producto');
// manejo de archivos
const fs = require('fs');
// crear el path de la ruta deseada
const path = require('path');

const { vrtificaTokenImg } = require('../middlewares/autenticacion');


app.get('/imagen/:tipo/:img', vrtificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    // console.log(pathImg);
    // valida si la imagen existe
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);

    } else {
        let noImagenPath = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noImagenPath);
    }
    // console.log(patImg);

})


module.exports = app;