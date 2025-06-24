import {format, formatDistanceToNowStrict} from "date-fns";
import { createToDo, renderTodo } from './toDoManager.js';


let allProjects = new Map();
let container = document.querySelector("#container");


function createProject (title, description, dueDate, toDoArray) {
    let uuid = self.crypto.randomUUID();
    const project = {
        title, description, dueDate, toDoArray,

        getID() {
            return uuid;
        },

        updateTitle(newTitle) {
            this.title = newTitle;
        },

        updateDescription(newDescription) {
            this.description = newDescription;
        }
    };
    allProjects.set(uuid, project);
    return project;
}

function renderProject () {
    container.text = "";
    allProjects.forEach((projectItem) => {
        const project = document.createElement("div");
        project.classList.add("project");
        project.dataset.projectid = projectItem.getID();

        const title = document.createElement("h2");
        title.classList.add("title");

        const titleExpand = document.createElement("a");
        titleExpand.href = "#";
        titleExpand.textContent = projectItem.title;
        title.appendChild(titleExpand);

        const addToDoBtn = document.createElement("button");
        addToDoBtn.className = "addToDoBtn";
        addToDoBtn.title = "Add To-Do";
        const addToDoBtnSymbol = document.createElement("i");
        addToDoBtnSymbol.className = "bx bx-message-square-add";
        addToDoBtn.appendChild(addToDoBtnSymbol);
        title.appendChild(addToDoBtn);

        const description = document.createElement("p");
        description.classList.add("desc");
        description.textContent = projectItem.description;

        const dueDate = document.createElement("div");
        dueDate.classList.add("dueDate");
        let dDate = projectItem.dueDate;
        let dueDateString = `${format(dDate, 'MMM do, yyyy')}`;
        dueDate.textContent = `Due Date: ${dueDateString}`;
        dueDate.title = `in ${formatDistanceToNowStrict(dDate)}`;


        let addToDoField = document.createElement("input");
        addToDoField.type = "text";
        addToDoField.placeholder = "Add a to-do and press Enter";
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
        project.appendChild(dueDate);
        project.appendChild(addToDoWrapper);

        addToDoBtn.addEventListener("click", () => {
            addToDoField.classList.add("visible");
            addToDoPriority.classList.add("visible");
            addToDoField.focus();
        });

        addToDoField.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const value = addToDoField.value.trim();
                const priority = addToDoPriority.value;
                if (value.length === 0) return;
                if (!projectItem.toDoArray) projectItem.toDoArray = [];
                const newToDo = createToDo(value, priority);
                projectItem.toDoArray.push(newToDo);
                addToDoField.value = "";

                const newTodoContainer = renderTodo(projectItem);

                const oldTodoContainer = project.querySelector('.todo-container');
                if (oldTodoContainer) oldTodoContainer.remove();
                project.appendChild(newTodoContainer);
                addToDoField.focus();
            }
        });

        const todoContainer = renderTodo(projectItem);
        project.appendChild(todoContainer);

        container.appendChild(project);
    });
}

function editDetails (e) {
    e.target
}


const todoss = [
    createToDo("Research React", "high"),
    createToDo("Practice TypeScript", "medium")
];

const project1 = createProject(
    "Learn JavaScript",
    "Complete the basics of JS including functions and objects",
    new Date("2025-06-30"),
    todoss
);

const project2 = createProject(
    "Build Portfolio",
    "Create a personal portfolio website using HTML/CSS",
    new Date("2025-07-15")
);

const project3 = createProject(
    "Read Design Patterns Book",
    "Study and implement common design patterns",
    new Date("2025-08-01")
);

renderProject();

console.log(allProjects);

export {
    allProjects as allProjects,
    createProject as createProject
};