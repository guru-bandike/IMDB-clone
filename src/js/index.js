const slider = document.querySelector("#slider");
const searchInput = document.querySelector("#search-input");
const moviesDisplayContainer = document.querySelector("#movies-display-container");
const toastMessage = document.querySelector(".toast-message");
const loader = document.querySelector(".loader");

let currentFetchController = null;

const fetchAPIUrl = "https://www.omdbapi.com/?apikey=5bcf2068";

searchInput.addEventListener("keyup", async (event) => {
  // Abort any ongoing fetch request
  if (currentFetchController) {
    currentFetchController.abort();
  }
  // Initialize a new AbortController for the current request
  currentFetchController = new AbortController();
  const signal = currentFetchController.signal;
  const movieName = event.target.value;

  movieName === "" ? showElement(slider) : hideElement(slider);
  hideToastMessage();
  moviesDisplayContainer.innerHTML = "";
  showElement(loader);

  const moviesList = await getMovies(movieName, signal);

  if (signal.aborted) {
    return;
  }

  hideElement(loader);

  if (moviesList) {
    addMoviesToDisplayContainer(moviesList);
  }
});

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

async function fetchMovies(query, queryParam, signal) {
  const url = fetchAPIUrl + queryParam + query;

  try {

    const data = await (await fetch(url, { signal })).json();
    if (data.Response === "False") throw new Error(data.Error);
    return data;

  } catch (error) {

    if (error.message === "The user aborted a request.") {
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
    } else {
      console.error(error);
    }

  }
}

async function addMoviesToDisplayContainer(moviesList) {
  moviesList.forEach((movie) => {
    addCurrentMovie(movie);
  });
}

function addCurrentMovie(movie) {
  const moviePosterSource =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "src/assets/svgs/no-image-available.svg";
  const movieRating =
    movie.imdbRating !== "N/A" ? movie.imdbRating + "/10" : "";
  let movieCard = `
    <div class="movie-card">
      <div class="movie-poster">
        <a href="">
          <img src="${moviePosterSource}" alt="Movie Poster" class="poster-image" />
        </a>
      </div>
      <div class="movie-info">
        <span class="movie-rating">
          <img src="src/assets/svgs/star-icon.svg" />
          <a id="imdb-rating" href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">${movieRating}</a>
        </span>
        <button class="add-to-favorites-btn">
          <img src="src/assets/svgs/add-to-favorites-icon.svg"/>
        </button>
      </div>
      <div class="movie-title-container">
        <a href="" class="movie-title">${movie.Title}</a>
      </div>
    </div>
  `;

  moviesDisplayContainer.insertAdjacentHTML("beforeend", movieCard);
}

if (slider) {
  let e = slider.querySelectorAll(".slider-item"),
    s = slider.querySelector(".switch");
  const t = e.length;
  let l,
    i = 0;

  for (; s.querySelectorAll("i").length != t; ) {
    let e = document.createElement("i");
    s.appendChild(e);
  }
  s = s.querySelectorAll("i");
  const c = (l) => {
      0 == l
        ? (e[t - 1].classList.remove("show"),
          e[t - 1].classList.add("hide"),
          s[t - 1].classList.remove("active"))
        : (e[l - 1].classList.remove("show"),
          e[l - 1].classList.add("hide"),
          s[l - 1].classList.remove("active")),
        l == t - 1
          ? e[0].classList.remove("hide")
          : e[l + 1].classList.remove("hide"),
        s[l].classList.add("active"),
        e[l].classList.add("show");
    },
    r = (l) => {
      0 == l
        ? (e[t - 1].classList.remove("show"),
          e[t - 1].classList.add("hide"),
          s[t - 1].classList.remove("active"))
        : (e[l - 1].classList.remove("show"),
          e[l - 1].classList.add("hide"),
          s[l - 1].classList.remove("active")),
        l == t - 1
          ? e[0].classList.remove("hide")
          : e[l + 1].classList.remove("hide"),
        l < t - 1
          ? (e[l + 1].classList.remove("show"),
            s[l + 1].classList.remove("active"))
          : (e[0].classList.remove("show"), s[0].classList.remove("active")),
        s[l].classList.add("active"),
        e[l].classList.add("show");
    };
  function startSlideShow() {
    l = setInterval(() => {
      nextSliderImage();
    }, 3000);
  }
  function nextSliderImage() {
    i++, i == t && (i = 0), c(i), clearInterval(l), startSlideShow();
  }
  function previousSliderImage() {
    i--, -1 == i && (i = t - 1), r(i), clearInterval(l), startSlideShow();
  }
  const a = slider.querySelector(".prev"),
    o = slider.querySelector(".next");
  o.addEventListener("click", nextSliderImage),
    a.addEventListener("click", previousSliderImage),
    c(i),
    startSlideShow();
}

function showToastMessage(message) {
  toastMessage.textContent = message;
  showElement(toastMessage);
}

function hideToastMessage() {
  hideElement(toastMessage);
  toastMessage.textContent = "";
}

function showElement(element) {
  if (element !== loader) {
    element.classList.add("slide-Up");
  }
  element.classList.remove("hide");
}

function hideElement(element) {
  element.classList.add("hide");
  element.classList.remove("slide-up");
}
