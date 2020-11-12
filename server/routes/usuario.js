const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    // res.json('get Usuario LOCAL!!!');

    // captura los parametros opcionales enviados en la url
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    // {} condicion para que muetre datos  (ejemplo google:true)
    // '' columnas que se muestran del schema

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // se salta
        .limit(limite) // muestra 
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // cuenta la cantidad de registros que hay en la bd
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    usuarios
                });
            })

        })
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    // crea una instancia del scgema usuario de la  BD
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // guardar el nuevo usuario
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })



});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    // pick saca una copia del request y entrega solo los atributos listados
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // busca en la bd el  id y realiza el update con el body dado,
    // devuelve el objeto actualizado y activa las validaciones del schema 
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // res.json('delete Usuario');
    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuario) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuario) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: 'Usuario no encontrado'
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario
    //     });

    // })

    let body = { estado: false };

    // busca en la bd el  id y realiza el update con el body dado,
    // devuelve el objeto actualizado y activa las validaciones del schema 
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


});

module.exports = app;