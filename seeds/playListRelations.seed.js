//  Importamos Mongoose:
const mongoose = require("mongoose");

// Conexión a la base de datos:
const { connect } = require("../db");

// Importamos la función que nos sirve para relacionar los documentos de nuestra BBDD:
const { playListRelations } = require("../utils/playListRelations");

//  Función asíncrona para conectar con la BBDD y ejecutar la función de reseteo de datos.
const playListRelationsSeed = async () => {
  try {
    await connect(); //  Esperamos a que conecte con la BBDD.
    await playListRelations(); //  Esperamos que ejecute la función.
    console.log("Datos relacionados");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console(error);
  } finally {
    //   Finalmente desconecta de la BBDD.
    await mongoose.disconnect();
  }
};

playListRelationsSeed(); //  Llamamos a la función.
