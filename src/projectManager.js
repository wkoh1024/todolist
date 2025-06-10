import {format, formatDistanceToNowStrict} from "date-fns";

let allProjects = new Map();
let container = document.querySelector("#container");


function createProject (title, description, dueDate, toDoArray) {
    let uuid = self.crypto.randomUUID();
    const getID = function () {
        return uuid;
    };
    const project = {title, description, dueDate, toDoArray, getID};
    allProjects.set(uuid, project);
    return project;
}

function renderProject () {
        allProjects.forEach((projectItem, uuid) => {
            const project = document.createElement("div");
            const title = document.createElement("h2");
            const titleExpand = document.createElement("a");
            const description = document.createElement("p");
            const dueDate = document.createElement("div");
            
            project.classList.add("project");
            title.classList.add("title");
            description.classList.add("desc");
            dueDate.classList.add("dueDate");
            titleExpand.href = "#";

            title.appendChild(titleExpand);
            project.appendChild(title);
            project.appendChild(description);
            project.appendChild(dueDate);

            let dDate = projectItem.dueDate;
            let dueDateString = `${format(dDate, 'MMM do, yyyy')}`;

            project.dataset.projectid = projectItem.getID();
            titleExpand.textContent = projectItem.title;
            description.textContent = projectItem.description;
            dueDate.textContent = `Due Date: ${dueDateString}`;
            dueDate.title = `in ${formatDistanceToNowStrict(dDate)}`;

            container.appendChild(project);
        });
}
const project1 = createProject(
    "Learn JavaScript",
    "Complete the basics of JS including functions and objects",
    new Date("2025-06-30")
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
    allProjects as allProjects
};
// console.log(self.crypto.randomUUID())