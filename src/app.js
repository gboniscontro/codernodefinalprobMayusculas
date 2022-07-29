
global.ADMINISTRADOR = true;
const logger = require('./logger')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const productosRouter = require('./routes/productsRoutes');
const carritoRouter = require('./routes/carritoRoutes');
const defRoute = require('./routes/default')
const webRoute = require('./routes/webRoutes')
const random = require('./routes/random')

const { ContenedorFake } = require('./contenedorfake')
const { Contenedor } = require('./contenedorsql') //, ContenedorMensaje 
const { ContenedorMensaje } = require('./contenedormongoose')
const Normal = require('./normal')
const path = require('path');
const { apiAuth, webAuth } = require('./middlewares/admin');
const webPass = require('./routes/webPassport');
const { MODO } = require('./config/globals');
const compression = require('compression');


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const normal = new Normal()
//const util = require('util')





let contenedor = new Contenedor('sqlite')
let contenedorfake = new ContenedorFake()
let contmensj = new ContenedorMensaje()

console.log(MODO);
app.use(compression({
    threshold: 1000
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

//Engine
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'views'));







app.use('/api/productos', apiAuth, productosRouter);
app.use('/api/carrito', apiAuth, carritoRouter);
app.use('/api/randoms', random);

app.use('/', webPass)
app.use('/', webRoute)

//agregue lo del index chat aca abajo
/*
app.post('/productos', async (req, res) => {
    const producto = req.body
    await contenedor.save(producto);
    let productos = await contenedor.getAll();
    io.sockets.emit('products', productos);
    res.redirect('/')
})


app.get('/productos', (req, res) => {

    let productos = contenedor.getAll()

    res.render("index", {
        productos,
        productosExists: productos.length
    });
});
app.get('/api/productos-test', (req, res) => {

    let productos = contenedorfake.getAll()

    res.render("index", {
        productos,
        productosExists: productos.length
    });
});
*/



//routes not found
//app.use('/*', defRoute)
io.on('connection', async function (socket) {
    console.log('un usuario se ha conectado');


    console.log('emitimos chat');
    let messages = await contmensj.getAll()


    // console.log('messages', util.inspect(messages, false, 6, true))
    console.log(JSON.stringify(messages).length)

    const normes = normal.apply(messages)
    // console.log('normes', util.inspect(normes, false, 6, true))
    console.log(JSON.stringify(normes).length)





    // socket.emit('messages', messages);
    socket.emit('messages', normes);
    socket.on('new-message', async function (data) {
        await contmensj.save(data)
        messages = await contmensj.getAll()
        // console.log('new-message', util.inspect(messages, true, 6, true))
        //    io.sockets.emit('messages', messages);
        const normes = normal.apply(messages)
        io.sockets.emit('messages', normes);
    })

})




/*

const serv = server.listen(PORT, () => {
    console.log('listening on port', serv.address().port);
})
serv.on('error', err => console.error('listening on port', err))
*/
/*

warning app not work with socket.io hay que usar httpserver
app.listen(port, () => {
    console.log(`Escuchando en el puerto 8080`);
});
*/
module.exports = app