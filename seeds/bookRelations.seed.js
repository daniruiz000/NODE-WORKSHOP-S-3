//  Importamos Mongoose:
const mongoose = require("mongoose");

// Conexión a la base de datos:
const { connect } = require("../db");

// Importamos la función que nos sirve para relacionar los documentos de nuestra BBDD:
const { bookRelations } = require("../utils/bookRelations");

//  Función asíncrona para conectar con la BBDD y ejecutar la función de reseteo de datos.
const seedBookRelations = async () => {
  try {
    await connect(); //  Esperamos a que conecte con la BBDD.
    await bookRelations(); //  Esperamos que ejecute la función.
    console.log("Datos relacionados");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console(error);
  } finally {
    //   Finalmente desconecta de la BBDD.
    await mongoose.disconnect();
  }
};

seedBookRelations(); //  Llamamos a la función.
