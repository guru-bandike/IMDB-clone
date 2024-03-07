// Define constants for accessing DOM elements
const slider = document.querySelector("#slider");
const searchInput = document.querySelector("#search-input");

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

  // Show or hide elements on key-up
  movieName === "" ? showElement(slider) : hideElement(slider);
  hideToastMessage();
  moviesDisplayContainer.innerHTML = "";
  showElement(loader);

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

//Function to manage slider functionality
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

// Helper fucntion to just validate this is not the favourites page.
function isThisFavouritesPage() {
  return false;
}
