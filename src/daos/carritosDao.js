const { TIPO_PERSISTENCIA } = require('../config/globals');
const carrito = require('../daos/carritosDaoMongo'); // + TIPO_PERSISTENCIA
/*
switch (TIPO_PERSISTENCIA) {
  case 'Mongo':
    carrito = require('../daos/carritosDaoMongo.js');
  case 'Firestore':
    carrito = require('../daos/carritosDaoFirestore.js');
}
*/
module.exports = carrito;
