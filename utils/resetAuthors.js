// Importamos el modelo
const { Author } = require("../models/Author.js");

// Creamos 50 autores aleatoriamente y los vamos añadiendo al array de autores:
const authorList = [
  { name: "Gabriel García Márquez", country: "Colombia" },
  { name: "Jane Austen", country: "England" },
  { name: "Leo Tolstoy", country: "Russia" },
  { name: "Virginia Woolf", country: "England" },
  { name: "Ernest Hemingway", country: "United States" },
  { name: "Jorge Luis Borges", country: "Argentina" },
  { name: "Franz Kafka", country: "Czechoslovakia" },
  { name: "Toni Morrison", country: "United States" },
  { name: "Haruki Murakami", country: "Japan" },
  { name: "Chinua Achebe", country: "Nigeria" },
];

//  Función de reseteo de documentos de la colección.
const resetAuthors = async () => {
  try {
    await Author.collection.drop(); //  Esperamos a que borre los documentos de la colección author de la BBDD.
    console.log("Borrados authors");
    await Author.insertMany(authorList); //  Esperamos a que inserte los nuevos documentos creados en la colección author de la BBDD.
    console.log("Creados authors correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetAuthors }; // Exportamos la función para poder usarla.
