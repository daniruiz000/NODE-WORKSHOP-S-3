// Importamos el modelo
const { Book } = require("../models/Book.js");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

// Creamos 50 books aleatoriamente y los vamos añadiendo al array de books:
const bookList = [];

for (let i = 0; i < 50; i++) {
  const newBook = {
    title: faker.random.words(3),
    pages: faker.datatype.number({ min: 50, max: 1000 }),
  };

  // Añadimos el book a nuestra array de books:
  bookList.push(newBook);
}

//  Función de reseteo de documentos de la colección.
const resetBooks = async () => {
  try {
    await Book.collection.drop(); //  Esperamos a que borre los documentos de la colección book de la BBDD.
    console.log("Borrados books");
    await Book.insertMany(bookList); //  Esperamos a que inserte los nuevos documentos creados en la colección book de la BBDD.
    console.log("Creados books correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetBooks }; // Exportamos la función para poder usarla.
