//  Importamos Mongoose:
const mongoose = require("mongoose");

// Conexión a la base de datos:
const { connect } = require("../db"); // Importamos el archivo de conexión a la BBDD

// Importamos la función que nos sirve para resetear los publisher:
const { resetPublishers } = require("../utils/resetPublishers");

//  Función asíncrona para conectar con la BBDD y ejecutar la función de reseteo de datos.
const seedFunction = async () => {
  try {
    await connect(); //  Esperamos a que conecte con la BBDD.
    await resetPublishers(); //  Esperamos que ejecute la función de reseteo de publisher.
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console(error);
  } finally {
    //   Finalmente desconecta de la BBDD.
    await mongoose.disconnect();
  }
};

seedFunction(); //  Llamamos a la función.
