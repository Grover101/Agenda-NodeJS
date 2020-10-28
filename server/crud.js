var Usuario = require("./modelUsers.js"); //Asignarle a la variable USUARIO el modelo del usuario

// funcion para crear los usuarios
module.exports.crearUsuarios = function (callback) {
  //   usuarios a crear
  var arr = [
    { email: "user@mail.com", user: "user", password: "123456" },
    { email: "hola@mail.com", user: "hola", password: "123456" },
  ];
  // funcion para insertar varios usuarios
  Usuario.insertMany(arr, function (error, docs) {
    if (error) {
      if (error.code == 11000) {
        callback(
          "Utilice los siguientes datos: </br>usuario: user | password:123456 </br>usuario: hola | password:123456"
        );
      } else {
        callback(error.message);
      }
    } else {
      callback(
        null,
        "El usuario 'user' y 'hola' se ha registrado correctamente. </br>usuario: user | password:123456 </br >usuario: hola | password:123456"
      );
    }
  });
};
