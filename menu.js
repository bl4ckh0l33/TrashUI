const openMobileMenu = document.getElementById("openMobileMenu");
const mobileMenu = document.getElementById("mobileMenu");

openMobileMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("invisible");
  console.log("abrindo ocultando menu");
});
