const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector("#new-proj-btn");
const closeModalBtn = document.querySelector("#close-modal");

const openNCloseModal = function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};

openModalBtn.addEventListener("click", openNCloseModal);
closeModalBtn.addEventListener("click", openNCloseModal);

