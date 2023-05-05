// Importamos el modelo
const { User } = require("../models/User.js");

// Creamos 50 autores aleatoriamente y los vamos añadiendo al array de autores:
const userList = [
  {
    firstName: "Juanito",
    lastName: "Colombia",
    email: "juanito@gmail.com",
  },
  {
    firstName: "Maria",
    lastName: "Lopez",
    email: "marialopez@hotmail.com",
  },
  {
    firstName: "Pedro",
    lastName: "Gonzalez",
    email: "pedro.gonzalez@gmail.com",
  },
  {
    firstName: "Carla",
    lastName: "Ramirez",
    email: "carlaramirez@gmail.com",
  },
  {
    firstName: "Ricardo",
    lastName: "Gomez",
    email: "ricardogomez@yahoo.com",
  },
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
  {
    firstName: "Lucia",
    lastName: "Sanchez",
    email: "lucia.sanchez@hotmail.com",
  },
];
//  Función de reseteo de documentos de la colección.
const resetUsers = async () => {
  try {
    await User.collection.drop(); //  Esperamos a que borre los documentos de la colección author de la BBDD.
    console.log("Borrados users");
    await User.insertMany(userList); //  Esperamos a que inserte los nuevos documentos creados en la colección author de la BBDD.
    console.log("Creados users correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetUsers }; // Exportamos la función para poder usarla.
