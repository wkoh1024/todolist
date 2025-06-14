const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector("#new-proj-btn");
const closeModalBtn = document.querySelector("#close-modal");
const toDo = document.querySelector("#toDo");
const toDoContainer = document.querySelector("#to-do");


const toggleModal = function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};

const toDoHandler = function (e) {
    // TODO: create new div, take input value
    // and assign to div, and then clear textbox
    if ((e.key === 'Enter')) {
      let toDoInputBox = e.target;
      let toDoInputBoxText = toDoInputBox.value;

      toDoInputBox.value = "";

      let toDoItem = document.createElement("div");
      toDoItem.textContent = toDoInputBoxText;

      toDoContainer.appendChild(toDoItem);
    }
};

toDo.addEventListener("keydown", toDoHandler)
openModalBtn.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal);

