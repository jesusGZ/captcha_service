const express = require('express');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const cors = require('cors');

const app = express();

app.use(express.json());

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3050', // Asegúrate de que no haya barra inclinada al final
  credentials: true
}));

// Configurar el middleware de sesiones
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia esto a true si usas HTTPS
}));

// Ruta para obtener un nuevo CAPTCHA
app.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6, // longitud del texto
    noise: 2, // número de líneas de ruido
    color: true // texto de colores
  });

  // Almacena el texto del CAPTCHA en la sesión
  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
});

// Ruta para verificar el CAPTCHA
app.post('/verify', (req, res) => {
  const userCaptcha = req.body.captcha;

  if (userCaptcha === req.session.captcha) {
    res.send('CAPTCHA correcto');
  } else {
    res.send('CAPTCHA incorrecto');
  }
});

app.listen(3001, () => {
  console.log('Servidor en ejecución en http://localhost:3001');
});
