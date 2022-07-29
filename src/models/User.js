const mongoose = require("mongoose");

const collection = "User"

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    address: String,
    password: String,
    age: Number
})



 //const users =
 module.exports = mongoose.model(collection, UserSchema)