import "./toDoManager.js";
import trashIcon from "./trash icon.svg"
import { createProject, renderProject } from "./projectManager.js";
import { createToDo } from "./toDoManager.js";

const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector("#new-proj-btn");
const closeModalBtn = document.querySelector("#close-modal");
const createProjectBtn = document.querySelector("#create-project");

const openModal = function () {
  modal.showModal();
};

const closeModal = function (e) {
  modal.close();
};



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

  if (checkForEmptyInputs(inputs)) {
    const projectItem = createProject(title);
    closeModal();
    renderProject(projectItem);
    document.querySelector("#title").value = "";
  }
};

createProjectBtn.addEventListener("click", createProjectHandler);
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);