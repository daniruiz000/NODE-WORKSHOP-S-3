// Importamos el modelo
const { Song } = require("../models/Song.js");
const { Artist } = require("../models/Artist.js");

const { generateRandom } = require("../utils/generateRandom");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

//  Función de reseteo de documentos de la colección.
const resetSongs = async () => {
  try {
    const artists = await Artist.find();
    if (!artists.length) {
      console.error("No hay artists en la BBDD.");
      return;
    }

    const songsList = [];
    for (let i = 0; i < 50; i++) {
      const newSong = {
        title: faker.music.songName(),
        duration: faker.datatype.number({ min: 120, max: 400 }),
        releaseYear: faker.datatype.number({ min: 1965, max: 2021 }),
        artist: artists[generateRandom(0, artists.length)],
      };

      songsList.push(newSong);
    }
    const documents = songsList.map((song) => new Song(song));
    await Song.collection.drop();
    console.log("Borrados songs");
    await Song.insertMany(documents);
    console.log("Creados songs correctamente");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { resetSongs };
