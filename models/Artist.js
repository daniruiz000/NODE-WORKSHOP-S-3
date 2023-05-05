//  Importamos Mongoose
const mongoose = require("mongoose");
// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;
// Creamos esquema del artist:
const artistSchema = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    activeSince: { type: Date, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un author valide contra el Schema que hemos creado para ver si es valido.
const Artist = mongoose.model("Artist", artistSchema);

//  Exportamos el modelo para poder usarlo fuera.
module.exports = { Artist };
