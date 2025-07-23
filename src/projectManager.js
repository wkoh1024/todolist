import {format, formatDistanceToNowStrict, parseISO} from "date-fns";
import { createToDo, renderTodo } from './toDoManager.js';
import { toZonedTime as utcToZonedTime } from 'date-fns-tz'; //
import { msny } from "./masonryView.js";


let allProjects = new Map();
let container = document.querySelector("#container");


function createProject (title, description, dueDate) {
    let uuid = self.crypto.randomUUID();
    const project = {
        title, description, dueDate, toDoMap: new Map(),

        getID() {
            return uuid;
        },

        updateTitle(newTitle) {
            this.title = newTitle;
        },

        updateDescription(newDescription) {
            this.description = newDescription;
        },

        updateDueDate(newDueDate) {
            this.dueDate = newDueDate;
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
    titleExpand.contentEditable= "plaintext-only";
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
        msny.remove(project);
        msny.layout();
    });
    title.appendChild(deleteBtn);

    const description = document.createElement("p");
    description.classList.add("desc");
    description.textContent = projectItem.description;
    description.contentEditable= "plaintext-only";
    description.addEventListener("blur", e => {
            if (projectItem.description !== e.target.textContent) {
                projectItem.updateDescription(e.target.textContent);
            }
        })

    let today = new Date();
    // must be in YYYY-MM-DD format for input type="date", this pads it if single digit
    let todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    let todayDay = String(today.getDate()).padStart(2, '0');
    let todayYear = today.getFullYear();
    today = `${todayYear}-${todayMonth}-${todayDay}`;

    const dueDateContainer = document.createElement("div");
    const dueDateText = document.createElement("div");
    const dueDate = document.createElement("input");
    dueDateContainer.className = "dueDate whitespace-pre-wrap";
    dueDate.type = "date";
    dueDate.min = today;


    dueDateText.textContent = "Due Date: ";
    dueDate.valueAsDate = flattenDatetoLocalTimeZone(projectItem.dueDate);
    dueDate.addEventListener("blur", e => {
        const newDate = e.target.value;
        projectItem.updateDueDate(flattenDatetoLocalTimeZone(newDate));
        dueDateContainer.title = `in ${formatDistanceToNowStrict(projectItem.dueDate)}`;
        console.log(projectItem.dueDate);
    });
    dueDateContainer.title = `in ${formatDistanceToNowStrict(projectItem.dueDate)}`;
    dueDateContainer.appendChild(dueDateText);
    dueDateContainer.appendChild(dueDate);

    const addToDoBtn = document.createElement("button");
    addToDoBtn.className = "addToDoBtn";
    addToDoBtn.textContent = "Add To-Do";

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
    project.appendChild(description);
    project.appendChild(dueDateContainer);
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
            const value = addToDoField.value.trim();
            const priority = addToDoPriority.value;
            if (value.length === 0) return;
            if (!projectItem.toDoMap) projectItem.toDoMap = new Map();
            const newToDo = createToDo(value, priority);
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
    });
    project.appendChild(todoContainer);

    container.appendChild(project);
    msny.appended(project);
    msny.layout();
}

let renderAllProjects = () => {
    allProjects.forEach((projectItem => {
        renderProject(projectItem);
    }))
}


const project1 = createProject(
    "Learn JavaScript",
    "Complete the basics of JS including functions and objects",
    new Date("2025-09-30")
);

let toDo1 = createToDo("Research React", "high")
project1.addToDo(toDo1);

let toDo2 = createToDo("Practice TypeScript", "medium");
project1.addToDo(toDo2);

const project2 = createProject(
    "Build Portfolio",
    "Create a personal portfolio website using HTML/CSS",
    new Date("2025-09-15")
);

const project3 = createProject(
    "Read Design Patterns Book",
    "Study and implement common design patterns",
    new Date("2025-10-01")
);

renderAllProjects();

console.log(allProjects);

export {
    allProjects as allProjects,
    createProject as createProject,
    renderProject
};