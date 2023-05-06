//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del user:
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un user valide contra el Schema que hemos creado para ver si es valido.
const User = mongoose.model("User", userSchema);

//  Exportamos el modelo para poder usarlo fuera.
module.exports = { User };
