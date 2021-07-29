// let home = id("homeIcon");
// let me = id("meIcon");
// home.addEventListener("click", () => {
//   home.style.backgroundImage = "url(./resources/homeSelected.svg)";
//   me.style.backgroundImage = "url(./resources/me.svg)";
// });
// me.addEventListener("click", () => {
//   home.style.backgroundImage = "url(./resources/home.svg)";
//   me.style.backgroundImage = "url(./resources/meSelected.svg)";
// });
let startCard = id("startCard");
let homePage = id("homePage");
let roomPage = id("roomPage");
let backButton = id("back");
console.log(homePage.style.display);
startCard.addEventListener("click", () => {
  homePage.style.display = "none";
  roomPage.style.display = "block";
});
backButton.addEventListener("click", () => {
  homePage.style.display = "block";
  roomPage.style.display = "none";
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
  return document.getElementsByClassName(className);
}

function gen(tagName) {
  document.createElement(`${tagName}`);
}
