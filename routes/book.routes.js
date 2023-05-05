// Importamos express:
const express = require("express");

// Importamos el modelo que nos sirve tanto para importar datos como para leerlos:
const { Book } = require("../models/Book.js");

// Importamos la función que nos sirve para resetear los book:
const { resetBooks } = require("../utils/resetBooks.js");

// Importamos la función que nos sirve para resetear los autores:
const { resetAuthors } = require("../utils/resetAuthors.js");

// Importamos la función que nos sirve para resetear las editoriales:
const { resetPublishers } = require("../utils/resetPublishers.js");

// Importamos la función que nos sirve para resetear las relaciones entre las coleciones:
const { bookRelations } = require("../utils/bookRelations.js");

// Router propio de book suministrado por express.Router:
const router = express.Router();

// --------------------------------------------------------------------------------------------
// --------------------------------- ENDPOINTS DE /book ---------------------------------------
// --------------------------------------------------------------------------------------------

/*  Endpoint para recuperar todos los books de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

router.get("/", async (req, res) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const page = req.query.page;
    const limit = parseInt(req.query.limit);

    const books = await Book.find() // Devolvemos los books si funciona. Con modelo.find().
      .populate(["author", "publisher"])
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit.

    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el usuario:
    const totalElements = await Book.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: books,
    };
    // Enviamos la respuesta como un json.
    res.json(response);

    // Si falla la lectura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

/* Ejemplo de REQ indicando que queremos la página 4 estableciendo un limite de 10 elementos
 por página (limit = 10 , pages = 4):
 http://localhost:3000/book?limit=10&page=4 */

//  ------------------------------------------------------------------------------------------

//  Endpoint para recuperar un book en concreto a través de su id ( modelo.findById()) (CRUD: READ):

router.get("/:id", async (req, res) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const book = await Book.findById(id).populate(["author", "publisher"]); //  Buscamos un book con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).
    if (book) {
      res.json(book); //  Si existe el book lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el book se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/book/id del book a buscar

//  ------------------------------------------------------------------------------------------

//  Endpoint para buscar un book por el title ( modelo.findById({firstName: name})) (CRUD: Operación Custom. No es CRUD):

router.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  // Si funciona la lectura...
  try {
    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate(["author", "publisher"]); //  Esperamos a que realice una busqueda en la que coincida el texto pasado por query params para la propiedad determinada pasada dentro de un objeto, porqué tenemos que pasar un objeto, sin importar mayusc o minusc.
    if (book?.length) {
      res.json(book); //  Si existe el book lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el book se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }

    // Si falla la lectura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/book/title/titulo del libro a buscar

//  ------------------------------------------------------------------------------------------

//  Endpoint para añadir elementos (CRUD: CREATE):

router.post("/", async (req, res) => {
  // Si funciona la escritura...
  try {
    const book = new Book(req.body); //     Un nuevo book es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdBook = await book.save(); // Esperamos a que guarde el nuevo book creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdBook); // Devolvemos un código 201 que significa que algo se ha creado y el book creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 si falla la escritura y el error.
  }
});

/* Petición tipo de POST para añadir un nuevo book (añadimos al body el nuevo book con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newBook = {title: "Prueba title", pages: 255}
 fetch("http://localhost:3000/book/",{"body": JSON.stringify(newBook),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */

//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos ejecutando cryptos:

router.delete("/reset", async (req, res, next) => {
  try {
    // La constante all recoge un boleano, si recogemos una query (all) y con valor (true), esta será true:
    const all = req.query.all === "true";

    // Si all es true resetearemos todos los datos de nuestras coleciones y las relaciones entre estas.
    if (all) {
      await resetBooks();
      await resetAuthors();
      await resetPublishers();
      await bookRelations();
      res.send("Datos reseteados y Relaciones reestablecidas");
    } else {
      await resetBooks();
      res.send("Datos Book reseteados");
    }
    // Si falla el reseteo...
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoint para eliminar book identificado por id (CRUD: DELETE):

router.delete("/:id", async (req, res) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const bookDeleted = await Book.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del book eliminado que busca y elimina con el metodo findByIdAndDelete(id del book a eliminar).
    if (bookDeleted) {
      res.json(bookDeleted); //  Devolvemos el book eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el delete y el error.
  }
});

/* Petición tipo DELETE para eliminar un book  identificado por su id (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta):

fetch("http://localhost:3000/book/id del book a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoint para actualizar un elemento identificado por id (CRUD: UPDATE):

router.put("/:id", async (req, res) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const bookUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true }); // Esperamos que devuelva la info del book actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el book actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del book a eliminar).
    if (bookUpdated) {
      res.json(bookUpdated); //  Devolvemos el book actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el update y el error.
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el title) recogidos en el body,
de un book en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/book/id del book a actualizar",{"body": JSON.stringify({title:"El libro de las ilusiones."}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

module.exports = { bookRouter: router }; // Exportamos el router.
