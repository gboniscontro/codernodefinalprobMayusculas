const ContainerMongo = require('../containers/ContainerMongo');
const productModel = require('../models/productos');
const ObjError = require('../objError');
class productDaoMongo extends ContainerMongo {
  constructor() {
    super(productModel);
  }

  async saveProduct(item) {
    try {
      item.timestamp = Date.now();
      const elem = await this.save(item);
      return elem._id;
    } catch (e) {
      throw new ObjError(500, 'Error al agregar un producto a la  base Mongo', e);
    }
  }

  async addProducts(products) {
    try {
      for (const p of products) {
        await this.saveProduct(p);
      }
    } catch (e) {
      throw new ObjError(500, 'Error al agregar productos a la  base Mongo', e);
    }
  }
}
const productos = new productDaoMongo();
module.exports = { productos };

/*import ContainerDao from './ContainerDao.js';

export default class UsuariosDao extends ContainerDao {
  constructor() {
    super('users');
  }

  async getByEmail(email) {
    return super.getById({ email: email });
  }

  async getByUsername(username) {
    return super.getById({ username: username });
  }

  async deleteByEmail(email) {
    return await super.deleteById({ email: email });
  }
}
/*import mongoose from 'mongoose';
import usersModel from '../models/user.js';

export default class UsersDaoDB {
  constructor() {
    this.model = mongoose.model(usersModel.collectionName, usersModel.schema);
  }
  getAll = async () => {
    let results = await this.model.find();
    return results;
  };
  save = async (user) => {
    let result = await this.model.create(user);
    return result;
  };
}*/
