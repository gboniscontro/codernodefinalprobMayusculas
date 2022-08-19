const { TIPO_PERSISTENCIA } = require('../config/globals');
const carrito = require('../daos/CarritosDaoMongo'); // + TIPO_PERSISTENCIA
/*
switch (TIPO_PERSISTENCIA) {
  case 'Mongo':
    carrito = require('../daos/CarritosDaoMongo.js');
  case 'Firestore':
    carrito = require('../daos/carritosDaoFirestore.js');
}
*/
module.exports = carrito;
