import {format, formatDistanceToNowStrict, parseISO} from "date-fns";
import { createToDo, renderTodo } from './toDoManager.js';
import { toZonedTime as utcToZonedTime } from 'date-fns-tz'; //


let allProjects = new Map();
let container = document.querySelector("#container");


function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
if (storageAvailable("localStorage")) {
} else {
}


function createProject (title) {
    let uuid = self.crypto.randomUUID();
    const project = {
        title, toDoMap: new Map(),

        getID() {
            return uuid;
        },

        updateTitle(newTitle) {
            this.title = newTitle;
        },
        getToDoMap() {
            return this.toDoMap;
        },

        addToDo(toDo) {
            this.toDoMap.set(toDo.getID(), toDo);
        }
    };
    allProjects.set(uuid, project);
    return project;
}

let flattenDatetoLocalTimeZone = (date) => {
    let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let localDueDate = utcToZonedTime(date, localTimeZone); 
    return localDueDate;
}

function renderProject (projectItem, firstIter) {
    const project = document.createElement("div");
    project.classList.add("project");
    project.dataset.projectid = projectItem.getID();

    const title = document.createElement("h2");
    title.classList.add("title");

    const titleExpand = document.createElement("a");
    titleExpand.href = "#";
    titleExpand.textContent = projectItem.title;
    title.appendChild(titleExpand);
    titleExpand.contentEditable= "false";
    titleExpand.addEventListener("blur", e => {
        if (e.target.textContent != projectItem.title) {
            projectItem.updateTitle(e.target.textContent);
            console.log(projectItem.title); 
        }
    })

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-project-btn");
    deleteBtn.addEventListener("click", (e) => {
        const projectElement = e.target.closest(".project");
        if (projectElement.classList.contains("focused")) {
            const overlay = document.querySelector(".overlay");
            if (overlay) {
                overlay.remove();
            }
        }
        allProjects.delete(projectItem.getID());
        projectElement.remove();
    });
    title.appendChild(deleteBtn);

    

    const addToDoBtn = document.createElement("button");
    addToDoBtn.className = "addToDoBtn";
    addToDoBtn.textContent = "Add To-Do";

    let addToDoField = document.createElement("input");
    addToDoField.type = "text";
    addToDoField.placeholder = "Title";
    addToDoField.className = "addToDoField";
    addToDoField.required = true;

    let addToDoDescription = document.createElement("input");
    addToDoDescription.type = "text";
    addToDoDescription.placeholder = "Description";
    addToDoDescription.className = "addToDoField";

    let addToDoDate = document.createElement("input");
    addToDoDate.type = "date";
    addToDoDate.className = "addToDoField";
    addToDoDate.valueAsDate = new Date();


    let addToDoPriority = document.createElement("select");
    addToDoPriority.className = "addToDoPriority addToDoField priority";
    [
        { value: "high", text: "High" },
        { value: "medium", text: "Medium" },
        { value: "low", text: "Low" }
    ].forEach(opt => {
        let option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        addToDoPriority.appendChild(option);
    });

        // default priority
    addToDoPriority.value = "medium";

    let addToDoSubmit = document.createElement("button");
    addToDoSubmit.type = "submit";
    addToDoSubmit.textContent = "Submit";
    addToDoSubmit.className = "addToDoSubmit";

    let addToDoForm = document.createElement("form");
    addToDoForm.className = "addToDoWrapper";
    addToDoForm.appendChild(addToDoField);
    addToDoForm.appendChild(addToDoDescription);
    addToDoForm.appendChild(addToDoDate);
    addToDoForm.appendChild(addToDoPriority);
    addToDoForm.appendChild(addToDoSubmit);

    project.appendChild(title);
    project.appendChild(addToDoBtn);
    project.appendChild(addToDoForm);

    addToDoBtn.addEventListener("click", () => {
        addToDoForm.classList.toggle("visible");
        addToDoField.classList.toggle("visible");
        addToDoDescription.classList.toggle("visible");
        addToDoDate.classList.toggle("visible");
        addToDoPriority.classList.toggle("visible");
        addToDoSubmit.classList.toggle("visible");
        addToDoField.focus();
    });

    const handleAddToDo = (e) => {
        e.preventDefault();
        const title = addToDoField.value.trim();
        const priority = addToDoPriority.value;
        const description = addToDoDescription.value.trim();
        const dueDate = addToDoDate.valueAsDate;
        if (!projectItem.toDoMap) projectItem.toDoMap = new Map();
        const newToDo = createToDo(title, description, priority, dueDate);
        projectItem.addToDo(newToDo);
        addToDoField.value = "";
        addToDoDescription.value = "";

        const todoContainer = project.querySelector('.todo-container');
        const newTodoElement = renderTodo(newToDo);
        todoContainer.appendChild(newTodoElement);
        addToDoField.focus();
    };

    addToDoForm.addEventListener("submit", handleAddToDo);

    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-container');
    projectItem.toDoMap.forEach(todoItem => {
        const todoElement = renderTodo(todoItem);
        todoContainer.appendChild(todoElement);
        todoElement.contentEditable = false;
    });
    project.appendChild(todoContainer);

    project.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-project-btn")) return;
        if (project.classList.contains("focused")) return;

        project.classList.add("focused");
        titleExpand.contentEditable= "plaintext-only";

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);

        let closeFocusedView = () => {
            project.classList.remove("focused");
            titleExpand.contentEditable= "false";
            
            overlay.remove();
            document.removeEventListener("keydown", handleEsc);
        }

        let handleEsc = (e) => {
            if (e.key === "Escape") {
                closeFocusedView();
            }
        }

        overlay.addEventListener("click", () => {
            closeFocusedView();
        });

        document.addEventListener("keydown", handleEsc);
    });

    container.appendChild(project);
    if (firstIter) {
        project.click();
    }
}

let renderAllProjects = () => {
    let firstIter = true;
    allProjects.forEach((projectItem => {
        (firstIter) ? (renderProject(projectItem, firstIter), firstIter = false) : renderProject(projectItem);
    }))
}


const defaultProject = createProject("First project");

let toDo1 = createToDo("First to do", "Wonder what this is going to be about", "high", new Date());
defaultProject.addToDo(toDo1);

renderAllProjects();

console.log(allProjects);

export {
    allProjects as allProjects,
    createProject as createProject,
    renderProject
};