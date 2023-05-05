// PLAYLIST
// Nombre
// Canciones (debe ser una lista de referencias a la entidad CANCIÓN)
// Creador (debe ser una referencia a la referencia USUARIO)

//  Importamos Mongoose
const mongoose = require("mongoose");
// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;
// Creamos esquema del playList:
const playListSchema = new Schema(
  {
    name: { type: String, required: true },
    songs: { type: mongoose.Schema.Types.Array, ref: "Song", required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un author valide contra el Schema que hemos creado para ver si es valido.
const Artist = mongoose.model("Artist", playListSchema);

//  Exportamos el modelo para poder usarlo fuera.
module.exports = { Artist };
