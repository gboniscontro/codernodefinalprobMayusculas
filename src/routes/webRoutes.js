const MongoStore = require('connect-mongo');
const { Router } = require('express');
const webController = require('../controllers/webController');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const logger = require('../logger');
const initializePassport = require('../services/passportService.js');
const { passAuth } = require('../middlewares/admin');
const path = require('path');
const os = require('os');
const webRoutes = Router();
initializePassport();
webRoutes.use(passport.initialize());
//webPass.use(passport.session())
webRoutes.use(passport.authenticate('session'));

const multer = require('multer');
/* Multer config */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'src/public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

webRoutes.get('/subirArchivos', webController.getSubirArchivo);
webRoutes.post('/subirArchivos', upload.single('miArchivo'), (req, res, next) => {
  logger.info(`POST /subirArchivos`);
  const file = req.file;
  if (!file) {
    const error = new Error('Error subiendo archivo');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(`Archivo <b>${file.originalname}</b> subido exitosamente`);
});

webRoutes.post('/signup', passport.authenticate('register', { failureRedirect: '/failedRegister' }), (req, res) => {
  res.send({ message: 'signed up' });
});

webRoutes.post('/failedRegister', (req, res) => {
  res.send({ error: 'I cannot register because the user already registered' });
});

webRoutes.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin' }), (req, res) => {
  //  res.send({ body: req.body, message: "Logged In" })
  res.redirect('/dashboard');
});

webRoutes.post('/failedLogin', (req, res) => {
  res.send({ error: 'I cannot login' });
});

webRoutes.get('/currentSession', (req, res) => {
  // res.send(req.session)
  res.send(req.user);
});

webRoutes.get('/logout', (req, res) => {
  const nombre = req.user?.username;
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      if (nombre) {
        res.render(path.join(process.cwd(), 'src/views/logout.hbs'), { nombre: nombre });
      } else {
        res.redirect('/');
      }
    }
  });
});

webRoutes.get('/dashboard', passAuth, (req, res) => {
  res.redirect('/home');
});

webRoutes.get('/home', passAuth, (req, res) => {
  //si o si tengo que usar handelblars para enviar la variable nombre a la vista no se puede hacer con un html como antes
  // res.sendFile(path.join(process.cwd(), '/index.html'))

  res.render(path.join(process.cwd(), 'src/views/index.hbs'), { nombre: req.user.username });
});

webRoutes.get('/', (req, res) => {
  res.redirect('/home');
});
webRoutes.get('/signup', (req, res) => {
  res.redirect('/signup.html');
});

webRoutes.get('/login', (req, res) => {
  const nombre = req.user?.username;
  if (nombre) {
    res.redirect('/');
  } else {
    res.redirect('/login.html');
  }
});
webRoutes.get('/info', (req, res) => {
  let shtml = '<html>';

  shtml += '<br>---------------------------------------------';
  shtml += '<br>         EL PROCESO DE NODE.JS         ';
  shtml += '<br>Id del proceso ........... ' + process.pid;
  shtml += '<br>Título.................... ' + process.title;
  shtml += '<br>Directorio de Node........ ' + process.execPath;
  shtml += '<br>Directorio Actual......... ' + process.cwd();
  shtml += '<br>Versión de Node........... ' + process.version;
  shtml += '<br>Plataforma (S.O.)......... ' + process.platform;
  shtml += '<br>Arquitectura (S.O.)....... ' + process.arch;
  shtml += '<br>Tiempo activo de Node..... ' + process.uptime();
  shtml += '<br>Argumentos del proceso.... ' + process.argv;
  shtml += '<br>Memoria Reservada rss' + process.memoryUsage().rss;
  shtml += '<br>Numero de Procesadores ' + os.cpus().length;
  res.send(shtml);
});

module.exports = webRoutes;
