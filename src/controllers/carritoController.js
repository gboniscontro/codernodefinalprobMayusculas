
const { response } = require('express')
const { TIPO_PERSISTENCIA } = require('../config/globals')
//const { carrito } = require('../models/carritoModel')
const { carrito } = require('../daos/CarritosDao' + TIPO_PERSISTENCIA)
//const { carrito } = require('../daos/CarritosDaoFirestore')
module.exports = {
    create: (request, response) => {

        carrito.saveCarrito({})
            .then((e) => response.status(200).json({ dato: e, message: 'Carrito creado exitosamente' }))

    },
    delete: (request, response) => {
        carrito.deleteById(request.params.id)
            .then((e) => response.status(200).json({ message: 'Carrito borrado exitosamente' }))
            .catch((e) => response.status(e.estado).json({ error: 'Error en borrado del carrito' }))

    },
    getById: (request, response) => {
        let id = request.params.id
        carrito.getById(id)
            .then((p) => {
                console.log("json p:", p)
                response.status(200).json({ dato: p, message: "carrito agregados al carrito" })
            })
            .catch((e) => response.status(400).json({ e: e, error: 'carrito no encontrado getall' }))
    },

    addProd: (request, response) => {
        try {
            let id = request.params.id
            let arrProd = request.body
            carrito.addProd(id, arrProd)
            return response.status(200).json({ carrito: arrProd, message: 'Producto agregado' })
        } catch (error) {
            return response.status(404).json({ error: 'Producto no agregado' })
        }

    },

    deleteByIdProd: (request, response) => {
        carrito.deleteByIdProd(request.params.id, request.params.id_prod)
            .then((e) => response.status(200).json({ message: 'Producto borrado exitosamente' }))
            .catch((e) => response.status(404).json({ error: e, message: 'Error en borrado del producto' }))

    }
}
