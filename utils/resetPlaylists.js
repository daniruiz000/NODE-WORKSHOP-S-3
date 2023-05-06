// Importamos el modelo
const { Playlist } = require("../models/Playlist.js");

// Creamos 50 playlist aleatoriamente y los vamos añadiendo al array de playlist:
const playlistArray = [{ name: "Grandes exitos" }, { name: "Mega Pelotazos" }, { name: "Mejores Boleros" }, { name: "Momentos romanticos" }];

//  Función de reseteo de documentos de la colección.
const resetPlaylists = async () => {
  try {
    await Playlist.collection.drop(); //  Esperamos a que borre los documentos de la colección plalist de la BBDD.
    console.log("Borrados playlist");
    await Playlist.insertMany(playlistArray); //  Esperamos a que inserte los nuevos documentos creados en la colección plalist de la BBDD.
    console.log("Creados playlist correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetPlaylists }; // Exportamos la función para poder usarla.
