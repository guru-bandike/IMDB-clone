// Define constants for accessing DOM elements
const moviesDisplayContainer = document.querySelector(
  ".movies-display-container"
);
const toastMessage = document.querySelector(".toast-message");
const loader = document.querySelector(".loader");

// API URL for fetching movies data
const fetchAPIUrl = "https://www.omdbapi.com/?apikey=b8d0cfbb";

// Helper function to perform fetch request
async function fetchMovies(query, queryParam, signal) {
  const url = fetchAPIUrl + queryParam + query;

  try {
    const data = await (await fetch(url, { signal })).json();
    if (data.Response === "False") throw new Error(data.Error);
    return data;
  } catch (error) {
    handleFetchError(error);
  }
}

// Function to handle fetch errors and toast messages
function handleFetchError(error) {
  if (error.name === "TypeError" && !navigator.onLine) {
    const message =
      "Oops! It seems you're offline. Please check your internet connection and try again...😊";
    showToastMessage(message);
  } else if (error.message === "The user aborted a request.") {
    console.log(
      "Fetch request aborted to optimize search results, ensuring responsiveness to rapid user input changes."
    );
  } else if (error.message === "Movie not found!") {
    const message =
      "Oops! We couldn't find the movie. Please double-check the movie name and try again...😊";
    showToastMessage(message);
  } else if (error.message === "Too many results.") {
    const message =
      "Oops! There are too many search results. Please try a more specific search query...😊";
    showToastMessage(message);
  } else if (
    isThisMovieDetailsPage() &&
    error.message === "Incorrect IMDb ID."
  ) {
    const message =
      "Oops! It looks like there's an issue with the movie ID in the URL 🙈. Please ensure that you are not tampering with the URL. Let's give it another shot! 🚀";
    showToastMessage(message);
  } else {
    console.error(error);
  }
}

// Function to add movies to the display container
async function addMoviesToDisplayContainer(moviesList) {
  moviesList.forEach((movie) => {
    addCurrentMovie(movie);
  });
}

// Function to create and add a single movie card
function addCurrentMovie(movie) {
  const moviePosterSource =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "src/assets/svgs/no-image-available.svg";
  const movieRating =
    movie.imdbRating !== "N/A" ? movie.imdbRating + "/10" : "";

  const itIsFavourite = isFavourite(movie.imdbID) ? "it-is-favourite" : "";

  let movieCard = `
    <div class="movie-card">
      <div class="movie-poster">
        <a href="movie-details.html?movieId=${movie.imdbID}">
          <img src="${moviePosterSource}" alt="Movie Poster" class="poster-image" />
        </a>
      </div>
      <div class="movie-info">
        <span class="movie-rating">
          <img src="src/assets/svgs/star-icon.svg" />
          <a id="imdb-rating" href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">${movieRating}</a>
        </span>
        <button class="favourite-toggle-btn ${itIsFavourite}" onclick="toggleFavourite(this)" data-imdb-ID="${movie.imdbID}">
        </button>
      </div>
      <div class="movie-title-container">
        <a href="movie-details.html?movieId=${movie.imdbID}" class="movie-title">${movie.Title}</a>
      </div>
    </div>
  `;

  moviesDisplayContainer.insertAdjacentHTML("beforeend", movieCard);
}

// Check if a movie is in the favourites list
function isFavourite(movieID) {
  const favourites = JSON.parse(localStorage.getItem("imdbFavourites")) || [];
  return favourites.includes(movieID);
}

// Favorite button actions
function toggleFavourite(toggleButton) {
  const movieID = toggleButton.getAttribute("data-imdb-ID");

  isFavourite(movieID)
    ? removeFromFavourites(movieID, toggleButton)
    : addToFavourites(movieID, toggleButton);
}

// Add movie to the favourites list
function addToFavourites(movieID, toggleButton) {
  const favourites = JSON.parse(localStorage.getItem("imdbFavourites")) || [];

  favourites.push(movieID);
  localStorage.setItem("imdbFavourites", JSON.stringify(favourites));
  toggleButton.classList.add("it-is-favourite");
}

// Remove movie from the favourites list
function removeFromFavourites(movieId, toggleButton) {
  let favourites = JSON.parse(localStorage.getItem("imdbFavourites"));

  favourites = favourites.filter((imdbID) => imdbID !== movieId);
  localStorage.setItem("imdbFavourites", JSON.stringify(favourites));
  toggleButton.classList.remove("it-is-favourite");

  if (isThisFavouritesPage()) {
    // Navigate up the DOM to find the .movie-card parent and remove it
    const movieCard = toggleButton.closest(".movie-card");
    if (movieCard) {
      movieCard.remove(); // Removes the movie card from the DOM

      // show toast message if the user removed all of his favourites
      if (favourites.length === 0) {
        const message = `Oops! It looks like you have removed all of your favorites...🚫 <br> Explore and find new gems to add...🎬🌟 <br> Your next favorite is a search away...!🔍`;
        showToastMessage(message);
      }
    }
  }
}

// Function to show taost message
function showToastMessage(message) {
  toastMessage.innerHTML = message;
  showElement(toastMessage);
}

// Function to hide taost message
function hideToastMessage() {
  hideElement(toastMessage);
  toastMessage.innerHTML = "";
}

// Helper function to show element with a small animation
function showElement(element) {
  if (element !== loader) {
    element.classList.add("slide-Up");
  }
  element.classList.remove("hide");
}

// Helper function to hide element
function hideElement(element) {
  element.classList.add("hide");
  element.classList.remove("slide-up");
}
