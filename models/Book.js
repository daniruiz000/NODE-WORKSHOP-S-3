//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del book:
const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: false }, // Identificará el id como una referencia de la entidad Author relacionando las dos colecciones de la BBDD.
    pages: { type: Number, required: false },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher", required: false }, // Identificará el id como una referencia de la entidad Publisher relacionando las dos colecciones de la BBDD.
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un book valide contra el Schema que hemos creado para ver si es valido.
const Book = mongoose.model("Book", bookSchema);

//  Exportamos el modelo para poder usarlo fuera.
module.exports = { Book };
