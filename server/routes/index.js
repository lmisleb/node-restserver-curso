const express = require('express');
const app = express();

//definicion de todas nuestras rutas
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;