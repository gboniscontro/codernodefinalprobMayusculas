const ContainerMongo = require('../containers/ContainerMongo')
const { productDaoMongo } = require('./ProductosDaoMongo')
const ObjError = require('../objError')

const CarritoModel = require('../models/carritos')

class CarritoDaoMongo extends ContainerMongo {
	constructor() {
		super(CarritoModel)
	}

	async saveCarrito(item) {
		let carrito = {};
		carrito.timestamp = Date.now();
		const nuevo_carrito = await this.save(carrito);
		return nuevo_carrito._id;

	}



	async addProd(id, arrProd) {
		try {
			//const producto = new productDaoMongo();
			const carrito = await this.getById(id);
			console.log(carrito)
			for (const p of arrProd) {
				//	const prod = await producto.getById(p.id)
				console.log(p)
				carrito.productos.push(p.id)

			}
			console.log(carrito)
			await this.updateById(id, carrito);
		} catch (err) {
			throw new ObjError(500, "Error al agregar productos al carrito", err)
		}
	}
	async deleteByIdProd(id, idprod) {
		const carrito = await this.getById(id);
		carrito.productos.pull(idprod);
		await carrito.save();
	}



}
const carrito = new CarritoDaoMongo()
module.exports = { carrito, CarritoDaoMongo }
