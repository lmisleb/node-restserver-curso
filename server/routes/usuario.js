const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

//===============================================================================
//                             Crear un nuevo Usuario
//===============================================================================

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body; // toma los valores que se ingresan

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // algoritmo de encriptación de un solo sentido con 10 vueltas
        role: body.role
    });

    usuario.save((err, usuarioCrear) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioCrear,
            mensaje: 'Usuario creado.'
        });

    });

});

//===============================================================================
//                               Lista Usuarios
//===============================================================================

app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email img estado google') // campos a mostrar
        .sort('nombre') // campo para ordenar la consulta
        .skip(desde) // para paginar la busqueda
        .limit(limite) // para indicar a cuanto mostrar
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    registros: conteo
                });

            });

        });

});

//===============================================================================
//                        Modifica un Usuario
//===============================================================================

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id; // toma el id que se está colocando en la URL
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // toma los valores que se ingresan

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioModificado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe.'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioModificado,
            mensaje: 'Usuario modificado'
        });

    })

});

//==================================================================================
//            Cambia el estado a false para que no liste el Usuario
//==================================================================================

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id; // toma el id que se está colocando en la URL

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario no encontrado.'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado,
            mensaje: 'Usuario borrado.'
        });

    })

});


//=====================================================================================
//                Elimina físicamente el registro del Usuario 
//=====================================================================================

// app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

//     let id = req.params.id; // toma el id que se está colocando en la URL
//     Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         };

//         if (!usuarioEliminado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     mensaje: 'Usuario no encontrado'
//                 }
//             });
//         };

//         res.json({
//             ok: true,
//             usuario: usuarioEliminado,
//             mensaje: 'Usuario eliminado.'
//         });

//     })

// });

module.exports = app;