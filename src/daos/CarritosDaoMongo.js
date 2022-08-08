const ContainerMongo = require('../containers/ContainerMongo');
const { productDaoMongo } = require('./productosDaoMongo');
const ObjError = require('../objError');
const logger = require('../logger');

const CarritoModel = require('../models/carrito');
const { array } = require('joi');

class CarritoDaoMongo extends ContainerMongo {
  constructor() {
    super(CarritoModel);
  }

  async saveCarrito(item) {
    let carrito = {};
    carrito.timestamp = Date.now();
    const nuevo_carrito = await this.save(carrito);
    return nuevo_carrito._id;
  }

  async addProd(id, arrProd) {
    try {
      //arrProd = JSON.parse(JSON.stringify(arrProd));
      logger.info('Agrego productos al carrito carrito.addProd', arrProd.length, id);
      // const producto = new productDaoMongo();
      const carrito = await this.getById(id);
      for (let i = 0; i < arrProd.length; i++) {
        //logger.info('Agrego productos =>', arrProd[i]);
        const encontreProducto = carrito.productos.findIndex((x) => x.valueOf() === arrProd[i]);
        //logger.info('dsp del indice');
        if (encontreProducto < 0) {
          //const prod = await producto.getById(arrProd[i]);
          //logger.info('antes del push');
          carrito.productos.push(arrProd[i]);
          carrito.productosCant.push(1);
        //  logger.info('dsp del push');
        } else {
          carrito.productosCant[encontreProducto]++;
        }
      }
      await this.updateById(id, carrito);
      //logger.info('salio bien el updatebyid');
    } catch (e) {
      throw new ObjError(500, 'Error al agregar productos al carrito', e);
    }
  }
  async deleteByIdProd(id, idprod) {
    const carrito = await this.getById(id);
    const encontreProducto = carrito.productos.findIndex((x) => x.valueOf() === arrProd[i]);

    carrito.productos.splice(encontreProducto, 1);
    carrito.productosCant.splice(encontreProducto, 1);
    await carrito.save();
  }
}
const carrito = new CarritoDaoMongo();
module.exports = { carrito, CarritoDaoMongo };
