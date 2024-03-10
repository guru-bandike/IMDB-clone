// Function to load the movie details page 
async function loadMovieDetailsPage() {
  // Retrieve the movieId from the URL search parameters
  const searchQuery = new URLSearchParams(window.location.search);
  const movieId = searchQuery.get("movieId");

  // Select the container where movie details will be displayed
  const movieDetailsContainer = document.querySelector(
    ".movie-details-container"
  );

  // Display the loader while fetching movie details
  showElement(loader);
  const movie = await fetchMovies(movieId, "&i=");
  // Hide the loader after fetching is complete
  hideElement(loader);

  // Proceed if movie data is successfully fetched
  if (movie) {
    // Determine the source for the movie poster or use a fallback image
    const moviePosterSource =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "src/assets/svgs/no-image-available.svg";
    // Format movie rating
    const movieRating =
      movie.imdbRating !== "N/A"
        ? `${movie.imdbRating}/10`
        : "";
    // Check if the movie is marked as a favourite
    const favouriteClass = isFavourite(movie.imdbID) ? "is-favourite" : "";

    // Construct HTML for movie details
    const movieDetailsHTML = `
      <div class="movie-details">
        <div class="title"> ${movie.Title} </div>
        
        <div class="movie-card">
          <div class="movie-poster">
            <img src="${moviePosterSource}" alt="Movie Poster" class="poster-image" />
          </div>
          <div class="movie-info">
            <span class="movie-rating">
              <img src="src/assets/svgs/star-icon.svg" />
              <a id="imdb-rating" href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">${movieRating}</a>
            </span>
            <button class="favourite-toggle-btn ${favouriteClass}" onclick="toggleFavourite(this)" data-imdb-id="${movie.imdbID}"></button>
          </div>
        </div>

        <p class="hide" ><span> 🎥Type: </span> ${movie.Type}</p>
        <p class="hide" ><span> 🗓️Released: </span> ${movie.Released}</p>
        <p class="hide" ><span> 📍Country: </span> ${movie.Country}</p>
        <p class="hide" ><span> 🗣️Language: </span> ${movie.Language}</p>
        <p class="hide" ><span> 💥Genre: </span> ${movie.Genre}</p>
        <p class="hide" ><span> ⏳Runtime: </span> ${movie.Runtime}</p>
        <p class="hide" ><span> ⭐Rating: </span> ${movie.imdbRating} on IMDb</p>
        <p class="hide" ><span> 🎬Director: </span> ${movie.Director}</p>
        <p class="hide" ><span> ✍️Writer: </span> ${movie.Writer}</p>
        <p class="hide" ><span> 🎭Actors: </span> ${movie.Actors}</p>
        <p class="hide" ><span> 📃Plot: </span> ${movie.Plot}</p>

      </div>
    `;

    // Update the innerHTML of the movie details container
    movieDetailsContainer.innerHTML = movieDetailsHTML;
    // Make relevant movie details visible
    revealAvailableMovieDetails();
  }
  
  // Reveals movie details if available
  function revealAvailableMovieDetails() {
    // Define an array of movie details
    const movieDetails = [
      movie.Type,
      movie.Released,
      movie.Country,
      movie.Language,
      movie.Genre,
      movie.Runtime,
      movie.imdbRating,
      movie.Director,
      movie.Writer,
      movie.Actors,
      movie.Plot,
    ];

    const moiveDetailsElements =
      document.querySelectorAll(".movie-details > p");

    movieDetails.forEach((detail, index) => {
      // Reveal movie detail if available
      if (detail !== "N/A")
        moiveDetailsElements[index].classList.remove("hide");
    });
  }


}

loadMovieDetailsPage();
