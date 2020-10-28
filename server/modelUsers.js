const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

// creacion de squema de los usuarios
const userSchema = new Schema({
  user: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const usuarioModel = mongoose.model("Usuario", userSchema); // definir el modelo del usuario

module.exports = usuarioModel; // exportar el modelo del usuario
