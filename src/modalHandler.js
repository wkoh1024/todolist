import "./toDoManager.js";
import trashIcon from "./trash icon.svg"
import { createProject } from "./projectManager.js";
import { createToDo } from "./toDoManager.js";

const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector("#new-proj-btn");
const closeModalBtn = document.querySelector("#close-modal");
const toDo = document.querySelector("#toDo");
const toDoContainer = document.querySelector("#to-do");
const dueDate = document.querySelector("#dueDate");
const createProjectBtn = document.querySelector("#create-project");
let toDoMap = new Map();

const openModal = function () {
  modal.showModal();
};

const closeModal = function (e) {
  modal.close();
};

const toDoInputHandler = function (e) {
    if ((e.key === 'Enter')) {
      let toDoInputBox = e.target;
      if (e.target.value.trim() !== "") {
        let toDoPriority = document.querySelector("select.priority").value;
        let toDoInputBoxText = toDoInputBox.value;

        toDoInputBox.value = "";

        let toDoItem = document.createElement("div");
        let toDoItemPriority = document.createElement("select");
        let deleteBtn = document.createElement("img");
        deleteBtn.src = trashIcon;
        deleteBtn.classList.add("delete-btn");
        toDoItemPriority.classList.add("priority");
        toDoItemPriority.innerHTML = `
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        `;

        deleteBtn.addEventListener("click", deleteToDo); 
        deleteBtn.tabIndex = 0;
        
        toDoItem.textContent = toDoInputBoxText;
        toDoItem.appendChild(toDoItemPriority);
        toDoItem.appendChild(deleteBtn);

        let createdToDo = createToDo(toDoInputBoxText, toDoPriority);
        toDoItem.dataset.todoId = createdToDo.getID();
        toDoContainer.appendChild(toDoItem);
      }
    }
};

let deleteToDo = (e) => {
  // delete from DOM
  let toDoItem = e.target.parentNode;
  let toDoItemID = toDoItem.dataset.todoid;
  toDoItem.remove();

  // delete from map
  if (toDoMap.has(toDoItemID)) {
    toDoMap.delete(toDoItemID);
  }
};

let resetModal = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#dueDate").value = "";
  document.querySelector("#toDo").value = "";
  toDoArray.length = 0;
  toDoContainer.innerHTML = ""; 
}

let checkForEmptyInputs = (inputs) => {
  for (let input of inputs) {
    if (input.trim() === "") {
      alert("Please fill in all fields.");
      return false;
    }
  }
  return true;
}

const createProjectHandler = function (e) {
  e.preventDefault();

  let inputs = [];
  const title = document.querySelector("#title").value;
  inputs.push(title);
  const description = document.querySelector("#description").value;
  inputs.push(description);
  const dueDateValue = dueDate.value;
  inputs.push(dueDateValue);

  if (checkForEmptyInputs(inputs)) {
    const projectItem = createProject(title, description, dueDateValue);
    projectItem.toDoMap = 
    closeModal();
    resetModal();
  }
};

createProjectBtn.addEventListener("click", createProjectHandler);
toDo.addEventListener("keydown", toDoInputHandler)
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);