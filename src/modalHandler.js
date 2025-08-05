import "./toDoManager.js";
import trashIcon from "./trash icon.svg"
import { createProject, renderProject } from "./projectManager.js";
import { createToDo } from "./toDoManager.js";

const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector("#new-proj-btn");
const closeModalBtn = document.querySelector("#close-modal");
const createProjectBtn = document.querySelector("#create-project");
const title = document.querySelector("#title");
const newProjectForm = document.querySelector("#new-project-form");

title.required = true;

const openModal = function () {
  modal.showModal();
};

const closeModal = function (e) {
  modal.close();
};

const createProjectHandler = function (e) {
  e.preventDefault();
  let inputs = [];

  let titleName = title.value;

  inputs.push(titleName);

    const projectItem = createProject(titleName);
    closeModal();
    renderProject(projectItem);
    document.querySelector("#title").value = "";
};

newProjectForm.addEventListener("submit", createProjectHandler);
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);