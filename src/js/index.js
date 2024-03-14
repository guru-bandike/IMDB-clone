// Define constants for accessing DOM elements
const carousel = document.querySelector(".carousel");
const searchInput = document.querySelector("#search-input");
const favouritesButton = document.querySelector("#favourites-btn");
// Note: Several functions have been moved to common.js for reuse across pages.
// This includes operations such as fetching movies (`fetchMovies`), displaying/hiding elements (`showElement`, `hideElement`),
// and showing toast messages (`showToastMessage`). This centralization helps in maintaining consistency and reducing code duplication.

// Variable to store the current fetch controller for aborting requests
let currentFetchController = null;

// Event listener for handling search input
searchInput.addEventListener("keyup", async (event) => {
  // Abort any ongoing fetch request
  if (currentFetchController) {
    currentFetchController.abort();
  }
  // Initialize a new AbortController for the current request
  currentFetchController = new AbortController();
  const signal = currentFetchController.signal;
  const movieName = event.target.value;

  // Exit the function and show or hide elements if the query is empty
  if (movieName === "") {
    hideElement(loader);
    showElement(carousel);
    hideToastMessage();
    moviesDisplayContainer.innerHTML = "";
    return ; 
  }
  
  // Show or hide elements on valid query
  showElement(loader);
  hideElement(carousel);
  hideToastMessage();
  moviesDisplayContainer.innerHTML = "";

  // Fetch movies list and update UI
  const moviesList = await getMovies(movieName, signal);

  if (signal.aborted) {
    return;
  }
  hideElement(loader);

  if (moviesList) {
    addMoviesToDisplayContainer(moviesList);
  }
});

// Function to fetch movies data
async function getMovies(movieName, currentFetchController) {
  const queryParam = "&s=";
  const response = await fetchMovies(
    movieName,
    queryParam,
    currentFetchController
  );

  if (response) {
    const moviesWithoutRating = response.Search;

    const moviesWithRating = await Promise.all(
      moviesWithoutRating.map(async (movie) => {
        const movieId = movie.imdbID;
        const queryParam = "&i=";
        const movieWithRating = await fetchMovies(movieId, queryParam);
        return movieWithRating;
      })
    );

    return moviesWithRating;
  }
}

// Function to initiate a search for a popular movie based on its name
function searchPopularMovie(movieElement) {
  // Extract the movie name from the data attribute of the passed element
  const movieName = movieElement.dataset.movieName;

  // Set the search input's value to the extracted movie name
  searchInput.value = movieName;

  // Simulate a keyup event to trigger input box event listener
  searchInput.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
}



// Helper fucntion to just validate this is not the favourites page.
function isThisFavouritesPage() {
  return false;
}

// Helper fucntion to just validate this is not the movie details page.
function isThisMovieDetailsPage() {
  return false;
}
