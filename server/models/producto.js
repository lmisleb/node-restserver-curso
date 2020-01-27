const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario."]
    },
    precioUni: {
        type: Number,
        required: [true, "El precio únitario es necesario."]
    },
    cantidad: {
        type: Number,
        required: [true, "La cantidad es necesaria."]
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    descripcion: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});

module.exports = mongoose.model("Producto", productoSchema);