//puerto
process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos de desarrollo y producción
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/db_cafe';
} else {
    urlDB = 'mongodb+srv://lmisle:kPrm26j8RhN8Tlsn@cluster0-ycb28.mongodb.net/db_cafe';
}

process.env.URLDB = urlDB;