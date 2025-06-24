const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector("#new-proj-btn");
const closeModalBtn = document.querySelector("#close-modal");
const toDo = document.querySelector("#toDo");
const toDoContainer = document.querySelector("#to-do");
const dueDate = document.querySelector("#dueDate");


const openModal = function () {
  modal.showModal();
};

const closeModal = function (e) {
  modal.close();
};

const toDoInputHandler = function (e) {
    if ((e.key === 'Enter')) {
      let toDoInputBox = e.target;
      let toDoInputBoxText = toDoInputBox.value;

      toDoInputBox.value = "";

      let toDoItem = document.createElement("div");
      toDoItem.textContent = toDoInputBoxText;

      toDoContainer.appendChild(toDoItem);
    }
};


toDo.addEventListener("keydown", toDoInputHandler)
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);