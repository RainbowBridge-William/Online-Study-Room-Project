let home = id("homeIcon");
let me = id("meIcon");
home.addEventListener("click", () => {
  home.style.backgroundImage = "url(./resources/homeSelected.svg)";
  me.style.backgroundImage = "url(./resources/me.svg)";
});
me.addEventListener("click", () => {
  home.style.backgroundImage = "url(./resources/home.svg)";
  me.style.backgroundImage = "url(./resources/meSelected.svg)";
});



function qs(name) {
  return document.querySelector(name);
}

function qsa(name) {
  return document.querySelectorAll(name);
}

function id(idName) {
  return document.getElementById(idName);
}

function cl(className) {
  return document.getElementsByClassName(className)
}

function gen(tagName) {
  document.createElement(`${tagName}`)
}