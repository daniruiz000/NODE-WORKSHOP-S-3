// Importamos los modelos:
const { User } = require("../models/User");
const { Artist } = require("../models/Artist");
const { Song } = require("../models/Song");
const { Playlist } = require("../models/Playlist");
const { generateRandom } = require("../utils/generateRandom");

//  Función de relación entre de documentos de la colección.
const playListRelations = async () => {
  try {
    //  Recuperamos books, publishers y authors:
    const users = await User.find();
    if (!users.length) {
      console.error("No hay users en la BBDD.");
      return;
    }
    const artists = await Artist.find();
    if (!artists.length) {
      console.error("No hay artists en la BBDD.");
      return;
    }
    let songs = await Song.find();
    if (!songs.length) {
      console.error("No hay songs en la BBDD.");
      return;
    }
    const playlistArray = await Playlist.find();
    if (!playlistArray.length) {
      console.error("No hay playlist en la BBDD.");
      return;
    }

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      const randomArtist = artists[generateRandom(0, artists.length)];
      song.artist = randomArtist;
      await song.save();
    }

    songs = await Song.find();

    if (!songs.length) {
      console.error("No hay songs en la BBDD.");
      return;
    }
    const songsId = songs.map((song) => song._id);

    for (let i = 0; i < playlistArray.length; i++) {
      const playList = playlistArray[i];

      const randomUser = users[generateRandom(0, users.length)];
      playList.createdBy = randomUser;

      const indexRandomSongs = generateRandom(0, songs.length);
      playList.songs = songsId.slice(indexRandomSongs, indexRandomSongs + 5);

      await playList.save();
    }

    console.log("Relaciones entre colecciones creadas correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { playListRelations }; // Exportamos la función para poder usarla.
