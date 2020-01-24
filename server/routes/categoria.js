const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');
const app = express();

//===============================================================================
//                            Crea una nueva Categoría
//===============================================================================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body; // toma los valores que se ingresan

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaCrear) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaCrear,
            mensaje: 'Categoría creada.'
        });

    });

});

//===============================================================================
//                            Lista todas las Categorías
//===============================================================================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}) // se le coloca una condición vacía al find para que traiga todas las categorías
        .sort('descripcion') // campo para ordenar la consulta
        .populate('usuario', 'nombre email') // muestra los sub-campos de otra tabla en el orden que se quiere
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    registros: conteo
                });

            });

        });

});

//===============================================================================
//                         Lista una Categoría por Id
//===============================================================================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id; // toma el id que se está colocando en la URL

    Categoria.findById(id, (err, categoriaId) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaId) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Esta categoría no existe.'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaId
        })

    })

});

//===============================================================================
//                            Actualiza una Categoría
//===============================================================================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id; // toma el id que se está colocando en la URL
    let body = req.body; // toma los valores que se ingresan

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaActualizada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaActualizada) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Esta categoría no existe.'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaActualizada,
            mensaje: 'Categoría Actualizada'
        });

    });

});

//===============================================================================
//                      Elimina físicamente una Categoría
//===============================================================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id; // toma el id que se está colocando en la URL

    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Esta categoría no existe.'
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Categoría eliminada.'
        })

    });

});

module.exports = app;