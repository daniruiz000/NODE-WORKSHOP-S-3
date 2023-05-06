//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del song:
const songSchema = new Schema(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    releaseYear: { type: Number, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: false }, // Identificará el id como una referencia de la entidad Publisher relacionando las dos colecciones de la BBDD.
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un song valide contra el Schema que hemos creado para ver si es valido.
const Song = mongoose.model("Song", songSchema);

//  Exportamos el modelo para poder usarlo fuera.
module.exports = { Song };
