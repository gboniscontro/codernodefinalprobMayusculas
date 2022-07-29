const MongoStore = require('connect-mongo')
const { Router } = require('express')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const initializePassport = require('../passport.config.js')
const { passAuth } = require('../middlewares/admin')
const path = require('path')
const os = require('os')




const webPass = Router()



initializePassport()
webPass.use(passport.initialize())
//webPass.use(passport.session())
webPass.use(passport.authenticate('session'))

webPass.post('/signup', passport.authenticate('register', { failureRedirect: '/failedRegister' }), (req, res) => {
    res.send({ message: "signed up" })

})

webPass.post('/failedRegister', (req, res) => {
    res.send({ error: "I cannot register" })
})

webPass.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin' }), (req, res) => {
    //  res.send({ body: req.body, message: "Logged In" })
    res.redirect('/dashboard')
})

webPass.post('/failedLogin', (req, res) => {
    res.send({ error: "I cannot login" })
})

webPass.get('/currentSession', (req, res) => {
    // res.send(req.session)
    res.send(req.user)
})

webPass.get('/logout', (req, res) => {
    const nombre = req.user?.username
    req.logout((err) => {
        if (err) { console.log(err) }
        else {


            if (nombre) {
                res.render(path.join(process.cwd(), 'src/views/logout.hbs'), { nombre: nombre })

            } else {
                res.redirect('/')
            }
        }
    })
})


webPass.get('/dashboard', passAuth, (req, res) => {
    res.redirect('/home')
})

webPass.get('/home', passAuth, (req, res) => {
    //si o si tengo que usar handelblars para enviar la variable nombre a la vista no se puede hacer con un html como antes
    // res.sendFile(path.join(process.cwd(), '/index.html'))

    res.render(path.join(process.cwd(), 'src/views/index.hbs'), { nombre: req.user.username })
})

webPass.get('/', (req, res) => {
    res.redirect('/home')
})
webPass.get('/signup', (req, res) => {
    res.redirect('/signup.html')
})

webPass.get('/login', (req, res) => {
    const nombre = req.user?.username
    if (nombre) {
        res.redirect('/')
    } else {
        res.redirect('/login.html')
    }
})
webPass.get('/info', (req, res) => {
    let shtml = "<html>"

    shtml += '<br>---------------------------------------------'
    shtml += '<br>         EL PROCESO DE NODE.JS         '
    shtml += '<br>Id del proceso ........... ' + process.pid
    shtml += '<br>Título.................... ' + process.title
    shtml += '<br>Directorio de Node........ ' + process.execPath
    shtml += '<br>Directorio Actual......... ' + process.cwd()
    shtml += '<br>Versión de Node........... ' + process.version
    shtml += '<br>Plataforma (S.O.)......... ' + process.platform
    shtml += '<br>Arquitectura (S.O.)....... ' + process.arch
    shtml += '<br>Tiempo activo de Node..... ' + process.uptime()
    shtml += '<br>Argumentos del proceso.... ' + process.argv
    shtml += '<br>Memoria Reservada rss' + process.memoryUsage().rss
    shtml += '<br>Numero de Procesadores ' + os.cpus().length
    res.send(shtml)


})

module.exports = webPass