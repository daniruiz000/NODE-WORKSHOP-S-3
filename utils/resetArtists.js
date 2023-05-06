// Importamos el modelo
const { Artist } = require("../models/Artist.js");

// Creamos 50 editorial aleatoriamente y los vamos añadiendo al array de editoriales:
const artistList = [
  { name: "Eminem", genre: "rap", activeSince: "1996", country: "United States" },
  { name: "Beyonce", genre: "R&B/Pop", activeSince: "1997", country: "United States" },
  { name: "Metallica", genre: "Heavy Metal/Rock", activeSince: "1981", country: "United States" },
  { name: "Adele", genre: "Soul/Pop", activeSince: "2006", country: "United Kingdom" },
  { name: "Ed Sheeran", genre: "Pop/Folk", activeSince: "2004", country: "United Kingdom" },
  { name: "Calvin Harris", genre: "Electronic/Dance", activeSince: "1999", country: "Scotland" },
  { name: "Kendrick Lamar", genre: "Hip Hop/Rap", activeSince: "2004", country: "United States" },
  { name: "Tame Impala", genre: "Psychedelic Rock/Pop", activeSince: "2007", country: "Australia" },
  { name: "Amy Winehouse", genre: "Soul/Jazz", activeSince: "2003", country: "United Kingdom" },
  { name: "Shakira", genre: "Pop/Latin", activeSince: "1990", country: "Colombia" },
];

//  Función de reseteo de documentos de la colección.
const resetArtists = async () => {
  try {
    const documents = artistList.map((artist) => new Artist(artist));
    await Artist.collection.drop(); //  Esperamos a que borre los documentos de la colección publisher de la BBDD.
    console.log("Borrados artist");
    await Artist.insertMany(documents); //  Esperamos a que inserte los nuevos documentos creados en la colección publisher de la BBDD.
    console.log("Creados artist correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetArtists }; // Exportamos la función para poder usarla.
