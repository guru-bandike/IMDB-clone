const slider = document.querySelector("#slider");

if (slider) {
  let e = slider.querySelectorAll(".slider-item"),
      s = slider.querySelector(".switch");
  const t = e.length;
  let l,i = 0;

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
