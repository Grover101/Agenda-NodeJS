// modulos necesarios
const http = require("http"),
  path = require("path"),
  express = require("express"),
  session = require("express-session"),
  bodyParse = require("body-parser"),
  MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose"),
  // definir la ruta y nombre de la DB utilizando mongodb
  connection = mongoose.connect(
    "mongodb://localhost/agendaDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (error) {
      if (error) console.log(error.name + " " + error.message);
      else console.log("Conectado a MongoDB");
    }
  );

const PORT = 3000; // pueto de conexion
const app = express(); // variable de express

const Server = http.createServer(app); // crear un servidor a traves del modulo http

app.use(express.static("../client")); // establece el direcctorio raiz
app.use(bodyParse.json()); // inicia el modulo body-parse para interpretar datos en formato JSON
app.use(bodyParse.urlencoded({ extended: true }));
app.use(
  session({
    // modulo de sesiones
    secret: "secret-pass",
    cookie: { maxAge: 3600000 },
    resave: false,
    saveUninitialized: true,
  })
);

// iniciar servidor
Server.listen(PORT, () => {
  console.log("Servidor iniado en el port: " + PORT); // mostrar mensaje de inicalizacion del servidor en la consola
});
