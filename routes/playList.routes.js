// Importamos express:
const express = require("express");

// Importamos el modelo que nos sirve tanto para importar datos como para leerlos:
const { Playlist } = require("../models/Playlist.js");

// Importamos la función que nos sirve para resetear los playList:
const { resetPlaylists } = require("../utils/resetPlaylists.js");

// Importamos la función que nos sirve para resetear los autores:
const { resetUsers } = require("../utils/resetUsers.js");

// Importamos la función que nos sirve para resetear las editoriales:
const { resetSongs } = require("../utils/resetSongs.js");

// Importamos la función que nos sirve para resetear las relaciones entre las coleciones:
const { playListRelations } = require("../utils/playListRelations.js");

const { resetArtists } = require("../utils/resetArtists.js");

// Router propio de playList suministrado por express.Router:
const router = express.Router();

// --------------------------------------------------------------------------------------------
// --------------------------------- ENDPOINTS DE /playList ---------------------------------------
// --------------------------------------------------------------------------------------------

/*  Endpoint para recuperar todos los playLists de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

router.get("/", async (req, res) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const page = req.query.page;
    const limit = parseInt(req.query.limit);

    const playlistArray = await Playlist.find() // Devolvemos los playLists si funciona. Con modelo.find().
      .populate([
        "createdBy",
        "songs",
        {
          path: "songs",
          populate: { path: "artist" },
        },
      ])

      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit.

    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el usuario:
    const totalElements = await Playlist.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: playlistArray,
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
 http://localhost:3000/playList?limit=10&page=4 */

//  ------------------------------------------------------------------------------------------

//  Endpoint para recuperar un playList en concreto a través de su id ( modelo.findById()) (CRUD: READ):

router.get("/:id", async (req, res) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id;
    const playList = await Playlist.findById(id).populate([
      "createdBy",
      "songs",
      {
        path: "songs",
        populate: { path: "artist" },
      },
    ]);

    if (playList) {
      res.json(playList); //  Si existe el playList lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el playList se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/playList/id del playList a buscar

//  ------------------------------------------------------------------------------------------

//  Endpoint para buscar un playList por el title ( modelo.findById({firstName: name})) (CRUD: Operación Custom. No es CRUD):

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;
  // Si funciona la lectura...
  try {
    const playList = await Playlist.find({ name: new RegExp("^" + name.toLowerCase(), "i") }).populate([
      "createdBy",
      "songs",
      {
        path: "songs",
        populate: { path: "artist" },
      },
    ]);

    if (playList?.length) {
      res.json(playList); //  Si existe el playList lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el playList se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }

    // Si falla la lectura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/playList/title/titulo del libro a buscar
//  ------------------------------------------------------------------------------------------

//  Endpoint para añadir una song de  una playlist :

router.post("/:id/song", async (req, res) => {
  // Si funciona la escritura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const playList = await Playlist.findById(id);

    if (playList) {
      const newSong = req.body.song;
      if (newSong) {
        playList.songs.push(newSong);
        const createdPlaylist = await playList.save();
        res.json(createdPlaylist); //  Devolvemos el playList actualizado en caso de que exista con ese id.
      } else {
        res.status(404).json({}).send("Tienes que añadir una canción para borrar");
      }
    } else {
      res.status(404).json({});
    }

    // Si falla la escritura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 si falla la escritura y el error.
  }
});

/* Petición tipo de POST para añadir un nuevo playList (añadimos al body el nuevo playList con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newPlaylist = {title: "Prueba title", pages: 255}
 fetch("http://localhost:3000/playList/",{"body": JSON.stringify(newPlaylist),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */

//  ------------------------------------------------------------------------------------------

//  Endpoint para añadir elementos (CRUD: CREATE):

router.post("/", async (req, res) => {
  // Si funciona la escritura...
  try {
    const playList = new Playlist(req.body); //     Un nuevo playList es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdPlaylist = await playList.save(); // Esperamos a que guarde el nuevo playList creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdPlaylist); // Devolvemos un código 201 que significa que algo se ha creado y el playList creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 si falla la escritura y el error.
  }
});

/* Petición tipo de POST para añadir un nuevo playList (añadimos al body el nuevo playList con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newPlaylist = {title: "Prueba title", pages: 255}
 fetch("http://localhost:3000/playList/",{"body": JSON.stringify(newPlaylist),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */

//  ------------------------------------------------------------------------------------------

//  Endpoint para eliminar una song de una playlist :

router.delete("/:id/song", async (req, res) => {
  // Si funciona la escritura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const playList = await Playlist.findById(id);

    if (playList) {
      const newSong = req.body.song;
      if (newSong) {
        const indexSong = playList.songs.indexOf(newSong);
        playList.songs.splice(indexSong, 1);
        const createdPlaylist = await playList.save();
        res.json(createdPlaylist);
      } else {
        res.status(404).json({}).send("Tienes que añadir una canción para borrar");
      }
    } else {
      res.status(404).json({});
    }

    // Si falla la escritura...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código de error 500 si falla la escritura y el error.
  }
});

/* Petición tipo de POST para añadir un nuevo playList (añadimos al body el nuevo playList con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newPlaylist = {title: "Prueba title", pages: 255}
 fetch("http://localhost:3000/playList/",{"body": JSON.stringify(newPlaylist),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */

//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos ejecutando cryptos:

router.delete("/reset", async (req, res, next) => {
  try {
    // La constante all recoge un boleano, si recogemos una query (all) y con valor (true), esta será true:
    const all = req.query.all === "true";

    // Si all es true resetearemos todos los datos de nuestras coleciones y las relaciones entre estas.
    if (all) {
      await resetPlaylists();
      await resetUsers();
      await resetArtists();
      await resetSongs();
      await playListRelations();
      res.send("Datos reseteados y Relaciones reestablecidas");
    } else {
      await resetPlaylists();
      res.send("Datos Playlist reseteados");
    }
    // Si falla el reseteo...
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoint para eliminar playList identificado por id (CRUD: DELETE):

router.delete("/:id", async (req, res) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const playListDeleted = await Playlist.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del playList eliminado que busca y elimina con el metodo findByIdAndDelete(id del playList a eliminar).
    if (playListDeleted) {
      res.json(playListDeleted); //  Devolvemos el playList eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el delete y el error.
  }
});

/* Petición tipo DELETE para eliminar un playList  identificado por su id (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta):

fetch("http://localhost:3000/playList/id del playList a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoint para actualizar un elemento identificado por id (CRUD: UPDATE):

router.put("/:id", async (req, res) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const playListUpdated = await Playlist.findByIdAndUpdate(id, req.body, { new: true }); // Esperamos que devuelva la info del playList actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el playList actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del playList a eliminar).
    if (playListUpdated) {
      res.json(playListUpdated); //  Devolvemos el playList actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el update y el error.
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el title) recogidos en el body,
de un playList en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/playList/id del playList a actualizar",{"body": JSON.stringify({title:"El libro de las ilusiones."}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

module.exports = { playListRouter: router }; // Exportamos el router.
