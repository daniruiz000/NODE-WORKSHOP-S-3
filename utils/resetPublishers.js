// Importamos el modelo
const { Publisher } = require("../models/Publisher.js");

// Creamos 50 editorial aleatoriamente y los vamos añadiendo al array de editoriales:
const publisherList = [
  { name: "RGB", country: "USA" },
  { name: "Amaya", country: "Spain" },
  { name: "Alianza Editorial", country: "Spain" },
  { name: "Alfaguara", country: "Argentina" },
];

//  Función de reseteo de documentos de la colección.
const resetPublishers = async () => {
  try {
    await Publisher.collection.drop(); //  Esperamos a que borre los documentos de la colección publisher de la BBDD.
    console.log("Borrados publishers");
    await Publisher.insertMany(publisherList); //  Esperamos a que inserte los nuevos documentos creados en la colección publisher de la BBDD.
    console.log("Creados publishers correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetPublishers }; // Exportamos la función para poder usarla.
