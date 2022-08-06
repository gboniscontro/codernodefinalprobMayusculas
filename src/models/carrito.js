const mongoose = require('mongoose')

const CarritoSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: false,
    },
    productos: [{
        type: String       
    }]

})

module.exports = mongoose.model('Carrito', CarritoSchema); 
