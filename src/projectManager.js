import {format, formatDistanceToNowStrict, parseISO} from "date-fns";
import { createToDo, renderTodo } from './toDoManager.js';
import { toZonedTime as utcToZonedTime } from 'date-fns-tz'; //


let allProjects = new Map();
let container = document.querySelector("#container");


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

function renderProject (projectItem) {
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
    deleteBtn.addEventListener("click", () => {
        allProjects.delete(projectItem.getID());
        
    });
    title.appendChild(deleteBtn);

    

    const addToDoBtn = document.createElement("button");
    addToDoBtn.className = "addToDoBtn";
    addToDoBtn.textContent = "Add To-Do";
    addToDoBtn.disabled = true;

    let addToDoField = document.createElement("input");
    addToDoField.type = "text";
    addToDoField.placeholder = "Press Enter to add";
    addToDoField.className = "addToDoField";


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

    let addToDoWrapper = document.createElement("div");
    addToDoWrapper.className = "addToDoWrapper";
    addToDoWrapper.appendChild(addToDoField);
    addToDoWrapper.appendChild(addToDoPriority);

    project.appendChild(title);
    project.appendChild(addToDoBtn);
    project.appendChild(addToDoWrapper);

    addToDoBtn.addEventListener("click", () => {
        addToDoWrapper.classList.toggle("visible");
        addToDoField.classList.toggle("visible");
        addToDoPriority.classList.toggle("visible");
        addToDoField.focus();
    });

    addToDoField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const title = addToDoField.value.trim();
            const priority = addToDoPriority.value;
            const description = "";
            const dueDate = new Date();
            if (title.length === 0) return;
            if (!projectItem.toDoMap) projectItem.toDoMap = new Map();
            const newToDo = createToDo(title, description, priority, dueDate);
            projectItem.addToDo(newToDo);
            addToDoField.value = "";

            const todoContainer = project.querySelector('.todo-container');
            const newTodoElement = renderTodo(newToDo);
            todoContainer.appendChild(newTodoElement);
            addToDoField.focus();
        }
    });

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
        
        addToDoBtn.disabled = false;

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);

        let closeFocusedView = () => {
            project.classList.remove("focused");
            titleExpand.contentEditable= "false";
            
            addToDoBtn.disabled = true;
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
}

let renderAllProjects = () => {
    allProjects.forEach((projectItem => {
        renderProject(projectItem);
    }))
}


const project1 = createProject("Frontend Development");

let toDo1 = createToDo("Learn React Hooks", "Study useState, useEffect, and useContext for managing component state and side effects.", "high", new Date("2025-08-15"))
project1.addToDo(toDo1);

let toDo2 = createToDo("Master CSS Grid", "Complete a few layouts using CSS Grid to understand its power.", "medium", new Date("2025-08-20"));
project1.addToDo(toDo2);

let toDo3 = createToDo("Build a small project with Webpack", "Set up a basic project with Webpack to understand module bundling.", "low", new Date("2025-09-01"));
project1.addToDo(toDo3);


const project2 = createProject("Personal");
let toDo4 = createToDo("Go grocery shopping", "Milk, bread, eggs, and cheese.", "medium", new Date("2025-08-02"));
project2.addToDo(toDo4);

renderAllProjects();

console.log(allProjects);

export {
    allProjects as allProjects,
    createProject as createProject,
    renderProject
};