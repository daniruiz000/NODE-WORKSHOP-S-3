const { resetArtists } = require("./resetArtists");
const { resetSongs } = require("./resetSongs");
const { resetUsers } = require("./resetUsers");
const { resetPlaylists } = require("./resetPlaylists");
//  Función de relación entre de documentos de la colección.
const playListRelations = async () => {
  try {
    await resetArtists();
    await resetUsers();
    await resetSongs();
    await resetPlaylists();

    console.log("Reseteados los datos y las Relaciones entre colecciones correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { playListRelations }; // Exportamos la función para poder usarla.
