//==========================================
// Puerto
//==========================================
process.env.PORT = process.env.PORT || 3000;

//==========================================
// Entorno
//==========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================================
// Vencimiento del token
//==========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

//==========================================
// SEED de autenticación
//==========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==========================================
// Base de datos de desarrollo y producción
//==========================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/db_cafe';
} else {
    urlDB = process.env.MONGODB_URI;
}

process.env.URLDB = urlDB;

//==========================================
// Google Client ID
//==========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1004247269775-hpoohiok7n66l9rkmjquu9840b1ed94v.apps.googleusercontent.com';