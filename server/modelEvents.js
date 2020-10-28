const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment"),
  // crear el squema de los eventos
  eventSchema = new Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: false },
    user: { type: Schema.ObjectId, ref: "Usuario" },
  });

autoIncrement.initialize(mongoose.connection); // iniciar el modulo de autoincrementar
eventSchema.plugin(autoIncrement.plugin, { model: "Evento", startAt: 1 }); // asigna el autoincrementado al esquema de Evento

const eventModel = mongoose.model("Evento", eventSchema);

module.exports = eventModel; // exportar el modulo evento
