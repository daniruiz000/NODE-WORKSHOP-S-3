// Importamos el modelo
const { Playlist } = require("../models/Playlist.js");
const { Song } = require("../models/Song.js");
const { User } = require("../models/User");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

const { generateRandom } = require("../utils/generateRandom");

// Creamos 50 playlist aleatoriamente y los vamos añadiendo al array de playlist:

//  Función de reseteo de documentos de la colección.
const resetPlaylists = async () => {
  try {
    const users = await User.find();
    if (!users.length) {
      console.error("No hay users en la BBDD.");
      return;
    }

    const songs = await Song.find();
    if (!songs.length) {
      console.error("No hay songs en la BBDD.");
      return;
    }

    const songsId = songs.map((song) => song._id);

    const playListArray = [];

    for (let i = 0; i < 4; i++) {
      const indexRandomSongs = generateRandom(0, songs.length);
      const newPlaylist = {
        name: faker.music.songName(),
        songs: songsId.slice(indexRandomSongs, indexRandomSongs + 5),
        createdBy: users[generateRandom(0, users.length)],
      };

      playListArray.push(newPlaylist);
    }

    const documents = playListArray.map((playlist) => new Playlist(playlist));
    await Playlist.collection.drop(); //  Esperamos a que borre los documentos de la colección plalist de la BBDD.
    console.log("Borrados playlist");
    await Playlist.insertMany(documents); //  Esperamos a que inserte los nuevos documentos creados en la colección plalist de la BBDD.
    console.log("Creados playlist correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetPlaylists }; // Exportamos la función para poder usarla.
