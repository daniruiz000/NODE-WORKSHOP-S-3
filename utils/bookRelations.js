// Importamos los modelos:
const { Book } = require("../models/Book");
const { Author } = require("../models/Author");
const { Publisher } = require("../models/Publisher");
const { generateRandom } = require("../utils/generateRandom");

//  Función de relación entre de documentos de la colección.
const bookRelations = async () => {
  try {
    //  Recuperamos books, publishers y authors:
    const books = await Book.find();
    if (!books.length) {
      console.error("No hay libros en la BBDD.");
      return;
    }
    const author = await Author.find();
    if (!author.length) {
      console.error("No hay autores en la BBDD.");
      return;
    }
    const publisher = await Publisher.find();
    if (!publisher.length) {
      console.error("No hay editoriales en la BBDD.");
      return;
    }
    // Para cada libro recogido elegimos un autor y una editorial al azar entre los existentes y se lo asignamos como una propiedad a cada libro.
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomAuthor = author[generateRandom(0, author.length)];
      const randomPublisher = publisher[generateRandom(0, publisher.length)];

      book.author = randomAuthor;
      book.publisher = randomPublisher;

      await book.save(); // Guardamos el libro creado con las nuevas propiedades.
    }
    console.log("Relaciones entre colecciones creadas correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { bookRelations }; // Exportamos la función para poder usarla.
