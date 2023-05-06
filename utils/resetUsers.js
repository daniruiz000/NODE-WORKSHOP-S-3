// Importamos el modelo
const { User } = require("../models/User.js");

// Creamos 50 autores aleatoriamente y los vamos añadiendo al array de autores:
const userList = [
  {
    firstName: "Ana",
    lastName: "Martinez",
    email: "ana.martinez@gmail.com",
  },
  {
    firstName: "Jose",
    lastName: "Gutierrez",
    email: "jose.gutierrez@hotmail.com",
  },
  {
    firstName: "Sofia",
    lastName: "Hernandez",
    email: "sofia.hernandez@gmail.com",
  },
  {
    firstName: "Jorge",
    lastName: "Perez",
    email: "jorge.perez@yahoo.com",
  },
];
//  Función de reseteo de documentos de la colección.
const resetUsers = async () => {
  try {
    const documents = userList.map((user) => new User(user));
    await User.collection.drop(); //  Esperamos a que borre los documentos de la colección author de la BBDD.
    console.log("Borrados users");
    await User.insertMany(documents); //  Esperamos a que inserte los nuevos documentos creados en la colección author de la BBDD.
    console.log("Creados users correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetUsers }; // Exportamos la función para poder usarla.
