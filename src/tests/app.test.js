const axios = require('axios');
const mongoose = require('mongoose');
const app = require('../app.js');
const logger = require('../logger');
const config = require('../config/globals');
const assert = require('assert');
const { info } = require('console');

const PORT = 8080; //config.PORT;
const newProduct = [
  {
    nombre: 'Articulo1',
    descripcion: 'Esta es la descripcion ',
    codigo: 'licazul',
    foto: 'https://st.depositphotos.com/1742172/5004/v/600/depositphotos_50040285-stock-illustration-cartoon-kitchen-blender.jpg',
    precio: 100,
    stock: 50,
  },
  {
    nombre: 'Articulo2',
    descripcion: 'Esta es la descripcion de la aspiradora',
    codigo: 'aspverde',
    foto: 'https://www.consumoteca.com/wp-content/uploads/Aspirador-escoba-y-de-mano-AEG.png',
    precio: 200,
    stock: 90,
  },
];
const url = 'http://localhost:8080';

function conectarServidor(app) {
  const server = app.listen(PORT, () => {});
  // server.on('error', (error) => logger.error(`Server error ${error}`));
}

before(async () => {
  mongoose
    .connect(config.MONGO_URI)
    .then((db) => {
      console.log('conectados a la base de datos');
      mongoose.connection.db.dropDatabase(function (err, result) {
        console.log(err);
      });
    })
    .then(() => conectarServidor(app));
});

describe('test de crear Productos y Carrito ', () => {
  let idprod1, idprod2;

  it('Deberia agregar dos productos al carrito', async () => {
    let { data: datanew } = await axios.post(url + '/api/productos', newProduct);
    const { data: dataAll } = await axios.get(url + '/api/productos');
    assert.strictEqual(dataAll.length, newProduct.length);
    idprod1 = dataAll[0]._id;
    idprod2 = dataAll[1]._id;
    logger.info(idprod1, idprod2);
    //el deepstricequal no lo puedo probar porque no tengo el timestamp y el id q se generan cuando inserta antes de hacer el test
    //assert.deepStrictEqual(dataAll, newProduct);
    const { data: datac } = await axios.post(url + '/api/carrito');
    let codCarrito = datac.dato;
    assert.ok(codCarrito);
    const addprod = [idprod1, idprod2];
    //logger.info(addprod);
    const { data: dataret } = await axios.post(url + '/api/carrito/' + codCarrito + '/productos', addprod);
    //    logger.info(dataret);
    const { data: dataget } = await axios.get(url + '/api/carrito/' + codCarrito + '/productos');
    //logger.info(JSON.stringify(dataget.dato.productos));
    //logger.info(JSON.stringify(addprod));
    assert.strictEqual(JSON.stringify(addprod), JSON.stringify(dataget.dato.productos));
    //  logger.info(dataget);
  });
});

/*
me puse a tratar de corregir unas cosas ahora que hice las clases de test me dio una falla en el agregar carrito
 no se q pasaba que los objetos me volvian loco para agregar los productos , 
 asi que hice el carrito de esta forma , un array de productos con solo el idstring , 
 y otro array con un numero con la cantidad , porque lamentablmente se me enquilombo manejarlo
  todo como si fuera objeto el array de productos que estaba en el carrito y me fallaba a cada rato,
   con esta implementacion estaria cumpliendo las consignas?*/