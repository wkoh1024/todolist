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

        const description = document.createElement("p");
        description.classList.add("desc");
        description.textContent = projectItem.description;

        const dueDate = document.createElement("div");
        dueDate.classList.add("dueDate");
        let dDate = projectItem.dueDate;
        let dueDateString = `${format(dDate, 'MMM do, yyyy')}`;
        dueDate.textContent = `Due Date: ${dueDateString}`;
        dueDate.title = `in ${formatDistanceToNowStrict(dDate)}`;

        project.appendChild(title);
        project.appendChild(description);
        project.appendChild(dueDate);

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