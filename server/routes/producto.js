const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const app = express();

//===============================================================================
//                           Crea un nuevo Producto
//===============================================================================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body; // toma los valores que se ingresan

    // en base al modelo
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        cantidad: body.cantidad,
        disponible: body.disponible,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    producto.save((err, productoCreado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoCreado,
            mensaje: 'Producto creado.'
        });

    });

});

//===============================================================================
//                          Busca un Producto por un termino
//===============================================================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex }) // mostrar todos los productos
        .populate('categoria', 'descripcion') // mostrar los sub-campos de otra tabla en el orden que se quiere
        .exec((err, productoTermino) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoTermino
            });

        });

});

//===============================================================================
//                           Lista todos los Productos
//===============================================================================

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }) // se le coloca esta condición para que solo muestre los disponibles
        .sort('categoria nombre') // campo para ordenar la consulta
        .populate('usuario', 'nombre email') // mostrar los sub-campos de otra tabla en el orden que se quiere
        .populate('categoria', 'descripcion') // mostrar los sub-campos de otra tabla en el orden que se quiere
        .skip(desde) // para paginar la busqueda
        .limit(limite) // para indicar a cuanto mostrar
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    registros: conteo
                });

            });

        });

});

//===============================================================================
//                          Lista un Producto por Id
//===============================================================================

app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id; // toma el id que se está colocando en la URL

    Producto.findById(id)
        .populate('usuario', 'nombre email') // mostrar los sub-campos de otra tabla en el orden que se quiere
        .populate('categoria', 'descripcion') // mostrar los sub-campos de otra tabla en el orden que se quiere
        .exec((err, productoId) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoId) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'Este producto no existe.'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoId
            })

        })

});


//===============================================================================
//                            Actualiza un Producto
//===============================================================================

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id; // toma el id que se está colocando en la URL
    let body = req.body; // toma los valores que se ingresan

    Producto.findByIdAndUpdate(id, {
        nombre: body.nombre,
        precioUni: body.precioUni,
        cantidad: body.cantidad,
        disponible: body.disponible,
        descripcion: body.descripcion,
        categoria: body.categoria
    }, { new: true, runValidators: true }, (err, productoActualizado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoActualizado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Este producto no existe.'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoActualizado,
            mensaje: 'Producto actualizado'
        });

    });

});

//==================================================================================
//            Cambia disponible a false para que no liste el Producto
//==================================================================================

app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id; // toma el id que se está colocando en la URL

    Producto.findByIdAndUpdate(id, {
        disponible: false,
        precioUni: 0,
        cantidad: 0,
        descripcion: 'Agotado'
    }, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Producto no encontrado.'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'Producto Borrado'
        });
    })
});

module.exports = app;