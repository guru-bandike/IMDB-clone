// Define constants for accessing DOM elements
const favouritesIDs = JSON.parse(localStorage.getItem("imdbFavourites"));

// Note: Several functions and constants have been moved to common.js for reuse across pages.
// This includes operations such as fetching movies (`fetchMovies`), adding movies (`addMoviesToDisplayContainer`),
// and showing toast messages (`showToastMessage`), displaying/hiding elements (`showElement`, `hideElement`), `loader`: A DOM element used to indicate loading processes.

/**
 * Fetches and displays the favourite movies based on stored IDs.
 * Shows a loader during the fetch operation and hides it afterward.
 */
async function loadFavouriteMovies() {
  showElement(loader);

  // Concurrently fetch details for all favourite movies using their IMDb IDs
  const favourites = await Promise.all(
    favouritesIDs.map(async (movieID) => {
      const query = movieID;
      const queryParam = "&i=";
      const favouriteMovie = await fetchMovies(movieID, queryParam);
      return favouriteMovie;
    })
  );

  hideElement(loader);
  // Add the fetched favourite movies to the display container on the page
  addMoviesToDisplayContainer(favourites);
}

/**
 * Checks if there are any stored favourite movie IDs
 * loads them if present
 * shows a toast message if not present
 */ 
if (favouritesIDs && favouritesIDs.length > 0) {
  loadFavouriteMovies();
} else {
  const message = `Oops! It looks like you haven't added any movies to your favourites yet...📃 <br> Let's head back to the home page and discover some amazing movies or series to fall in love with...🎞️ <br> Your next favorite film is just a click away...!👆`;
  showToastMessage(message);
}

// Helper fucntion to just validate this is the favourites page
function isThisFavouritesPage() {
  return true;
}
