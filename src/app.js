global.ADMINISTRADOR = true;
const logger = require('./logger');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const productosRouter = require('./routes/productosRoutes');
const carritoRouter = require('./routes/carritosRoutes');
const defRoute = require('./routes/default');
const webRoute = require('./routes/webRoutes');
const random = require('./routes/random');

const { ContenedorMensaje } = require('./daos/MensajesDaoMongo');
const Normal = require('./normal');
const path = require('path');
const { apiAuth, webAuth } = require('./middlewares/admin');
//const webPass = require('./routes/webPassport');
const { MODO } = require('./config/globals');
const compression = require('compression');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const normal = new Normal();
//const util = require('util')
/*
async () => {
  logger.info('BORRO LA BASE DE DATOS PARA EMPEZAR DE CERO');
  const db = await MongoStore.connect(config.MONGO_URI);
  await db.dropDatabase(function (err, result) {
    logger.error(err);
  });
};
*/

console.log(MODO);
app.use(
  compression({
    threshold: 1000,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 60000,
    },
  }),
);

//Engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//habia puesto un apiAuth para si no estaba autenticado no poder acceder a la api pero no funcionaba
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/randoms', random);

//app.use('/', webPass);
app.use('/', webRoute);

module.exports = app;
