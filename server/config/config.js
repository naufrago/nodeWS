// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


//  ambiente 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// vencimiento del token
// seg * min * hor * dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//semilla
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.urlDB = urlDB;

// cliente id de google
process.env.CLIENT_ID = process.env.CLIENT_ID || '768752331621-f5cp62onf3gdubvm0qvdib8ishmbbopl.apps.googleusercontent.com';