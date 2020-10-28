const Router = require("express").Router();
const Usuarios = require("./modelUsuarios.js");
const Eventos = require("./modelEventos.js");
const Operaciones = require("./crud.js");

Router.get("/users", function (req, res) {
  Usuarios.find({ user: req.query.user }).count({}, function (err, count) {
    // verificar si existe el usuario user
    if (count > 0)
      res.send(
        "Utilice los siguientes datos: </br>usuario: user | password:123456 </br>usuario: hola | password:123456"
      );
    else {
      Eventos.find({}).count({}, function (err, count) {
        // verificar si hay algun evento
        if (count > 0) {
          // si existen eventos hay que borrarlos
          Eventos.remove({}, function (err, doc) {
            if (err) {
              console.log(err);
            } else {
              console.log("Información de eventos reinicializada"); // mostrar mensaje en cónsola
            }
          });
        }
      });
      // crear a los usuarios por defecto si no hay ninguno
      Operaciones.crearUsuarioDemo((error, result) => {
        if (error) {
          res.send(error); // enviar mensaje de error
        } else {
          res.send(result); // enviar mensaje de resultado
        }
      });
    }
  });
});

// validar formulario de inicio de sesion
Router.post("/login", function (req, res) {
  let user = req.body.user; // obtener la informacion del nombre de usuario enviada desde el formulario
  let password = req.body.pass, // obtener la informacion de la conrtaseña de usuario enviada desde el formulario
    sess = req.session; // iniciar el manejador de sesiones
  Usuarios.find({ user: user }).count({}, function (err, count) {
    // verificar que el usuario está registrado
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      if (count == 1) {
        Usuarios.find({ user: user, password: password }).count({}, function (
          err,
          count
        ) {
          // verificar su contraseña
          if (err) {
            res.status(500); // devolver status de error
            res.json(err); // devolver devolver el error en formato json
          } else {
            if (count == 1) {
              // si ambos campos coinciden con el registro de la base de datos, enviar mensaje Validado
              sess.user = req.body.user; // guardar el nombre del usuario en la variable de manejo de sesiones
              res.send("Validado"); // devolver mensaje
            } else {
              res.send("Contraseña incorrecta");
            }
          }
        });
      } else {
        res.send("Usuario no registrado"); // mostrar mensaje Usuario o registrado
      }
    }
  });
});

// validar formulario de inicio de sesion
Router.post("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err); // mostrar mensaje de error en cónsola
      res.json(err); // devolver mensaje de error
    } else {
      req.session = null; // elimina las cookies de la session
      res.send("logout"); // devolver logout como respuesta
      res.end();
    }
  });
});

Router.all("*", function (req, res) {
  res.send(
    "Error al mostrar el recurso solicitado. Por favor verifique la dirección url a la cual desea ingresar"
  );
  res.end();
});

module.exports = Router; // exportar el módulo Router
