// Importamos el modelo
const { Song } = require("../models/Song.js");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

// Creamos 50 songs aleatoriamente y los vamos añadiendo al array de songs:
const bookList = [];

for (let i = 0; i < 50; i++) {
  const newSong = {
    title: faker.music.songName(),
    duration: faker.datatype.number({ min: 120, max: 400 }),
    releaseYear: faker.date.betweens("1965-01-01T00:00:00.000Z", "2021-01-01T00:00:00.000Z", 1),
  };

  // Añadimos el book a nuestra array de songs:
  bookList.push(newSong);
}

//  Función de reseteo de documentos de la colección.
const resetSongs = async () => {
  try {
    await Song.collection.drop(); //  Esperamos a que borre los documentos de la colección book de la BBDD.
    console.log("Borrados songs");
    await Song.insertMany(bookList); //  Esperamos a que inserte los nuevos documentos creados en la colección book de la BBDD.
    console.log("Creados songs correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetSongs }; // Exportamos la función para poder usarla.
