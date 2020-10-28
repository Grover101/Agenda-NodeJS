const RouterEventos = require("express").Router();
const Usuario = require("./modelUsuarios.js");
const Evento = require("./modelEventos.js");

// obtener todos los eventos del usuario logueado
RouterEventos.get("/all", function (req, res) {
  req.session.reload(function (err) {
    if (req.session.user) {
      // verificar que haya un usuario con sesión iniciada
      if (err) {
        res.send("logout");
        res.end();
      } else {
        Usuario.findOne({ user: req.session.user }).exec({}, function (
          error,
          doc
        ) {
          if (error) {
            res.send("logout");
          } else {
            Evento.find({ user: doc._id }).exec(function (err, doc) {
              // ejecutar sentencia para buvcar todos los registros en la base de datos correspondientes al usuario logueado
              if (err) {
                res.status(500);
                res.json(err);
              }
              res.json(doc); // devolver el array de información
            });
          }
        });
      }
    } else {
      // si no existe sesión iniciada
      res.send("logout");
      res.end();
    }
  });
});

RouterEventos.all("/", function (req, res) {
  res.send(
    "Error al mostrar el recurso solicitado. Por favor verifique la dirección url a la cual desea ingresar"
  );
  res.end();
});

// crear eventos
RouterEventos.post("/new", function (req, res) {
  // recargar la información de la sesión guardada
  req.session.reload(function (err) {
    if (err) {
      console.log(err);
      res.json("logout");
    } else {
      Usuario.findOne({ user: req.session.user }).exec({}, function (
        error,
        doc
      ) {
        // obtiene el ultimo valor del registro
        Evento.nextCount(function (err, count) {
          newID = count; // asignar el valor del identificador a la variable newID
        });

        // asigna los valores que vienen del formulario
        let title = req.body.title,
          start = req.body.start,
          end = req.body.end,
          userId = doc._id;

        // crear el objeto
        let evento = new Evento({
          title: title,
          start: start,
          end: end,
          user: userId,
        });
        evento.save(function (error) {
          // guardar el registro en la base de datos
          if (error) {
            console.log(error);
            res.json(error);
          }
          res.json(newID); // devolver el valor del ultimo id como callback para ser utilizado como parámetro _id en el renderizado del último evento creado
        });
      });
    }
  });
});

// eliminar un evento que coincida con su id
RouterEventos.post("/delete/:_id", function (req, res) {
  let id = req.params._id; // obtener el identificador del evento
  req.session.reload(function (err) {
    if (err) {
      console.log(err);
      res.send("logout");
    } else {
      // remueve el registro con el id
      Evento.remove({ _id: id }, function (error) {
        if (error) {
          console.log(error);
          res.status(500);
          res.json(error);
        }
        res.send("Registro eliminado");
      });
    }
  });
});

// actualizar evento
RouterEventos.post("/update/:_id&:start&:end", function (req, res) {
  // obtener el identificador el evento, fecha de inicio y finalización desde el formulario
  req.session.reload(function (err) {
    if (err) {
      console.log(err);
      res.send("logout");
    } else {
      Evento.findOne({ _id: req.params._id }).exec((error, result) => {
        // encontrar el evento por su identificador y asignar los valores que vienen desde el formulario
        let id = req.params._id,
          start = req.params.start,
          end = req.params.end;
        if (error) {
          res.send(error);
        } else {
          Evento.update(
            { _id: id },
            { start: start, end: end },
            (error, result) => {
              if (error) {
                res.send(error);
              } else {
                res.send("Evento ha sido actualizado");
              }
            }
          );
        }
      });
    }
  });
});

module.exports = RouterEventos; // exportar rutas de los eventos
