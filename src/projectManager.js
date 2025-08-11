import {format, formatDistanceToNowStrict, parseISO} from "date-fns";
import { createToDo, renderTodo } from './toDoManager.js';
import { toZonedTime as utcToZonedTime } from 'date-fns-tz';

let container = document.querySelector("#container");

const mapProxyHandler = {
    get(target, property, receiver) {
        const originalMethod = target[property];

        if (['set', 'delete', 'clear'].includes(property)) {
            return function(...args) {
                originalMethod.apply(target, args);
                saveProjects();
            };
        }

        if (typeof originalMethod === 'function') {
            return originalMethod.bind(target);
        }
        return originalMethod;
    }
};

let projectsStore = new Map();
let allProjects = new Proxy(projectsStore, mapProxyHandler);

function replacer(key, value) {
    if(value instanceof Map) {
        return { __type: 'Map', value: Array.from(value.entries()) };
    }
    return value;
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.__type === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function saveProjects() {
    const serializedProjects = JSON.stringify(projectsStore, replacer);
    localStorage.setItem('myProjects', serializedProjects);
}

function rehydrateProject(plainProject) {
    let id = plainProject.id;

    plainProject.getID = function() { return id; };

    plainProject.updateTitle = function(newTitle) {
        this.title = newTitle;
        allProjects.set(id, this);
    };

    plainProject.getToDoMap = function() { return this.toDoMap; };

    plainProject.addToDo = function(toDo) {
        this.toDoMap.set(toDo.getID(), toDo);
        allProjects.set(id, this);
    };

    plainProject.toJSON = function() {
        return {
            id: id,
            title: this.title,
            toDoMap: this.toDoMap
        };
    };

    if (plainProject.toDoMap) {
        plainProject.toDoMap.forEach(plainTodo => {
            let todoId = plainTodo.id;
            plainTodo.updateTitle = function(newTitle) {
                this.title = newTitle;
                allProjects.get(id).getToDoMap().set(id, this);
            }
            plainTodo.updateDescription = function(newDescription) {
                this.description = newDescription;
                allProjects.get(id).getToDoMap().set(id, this);
            }
            plainTodo.updatePriority = function(newPriority) {
                this.priority = newPriority;
            }
            plainTodo.updateDueDate = function(newDueDate) {
                this.dueDate = newDueDate;
            }
            plainTodo.toggle = function() {
                this.completed = !this.completed;
            }
            plainTodo.getID = function() { return todoId; };
            plainTodo.dueDate = parseISO(plainTodo.dueDate);
        });
    }
    return plainProject;
}

function loadProjects() {
    const storedProjects = localStorage.getItem('myProjects');
    if (!storedProjects) return null;

    const parsedProjects = JSON.parse(storedProjects, reviver);

    parsedProjects.forEach((project, id) => {
        const rehydratedProject = rehydrateProject(project);
        parsedProjects.set(id, rehydratedProject);
    });

    return parsedProjects;
}

function createProject (title) {
    let uuid = self.crypto.randomUUID();

    const project = {
        title,
        toDoMap: new Map(),

        getID() { return uuid; },

        updateTitle(newTitle) {
            this.title = newTitle;
            allProjects.set(uuid, this);
        },
        getToDoMap() { return this.toDoMap; },

        addToDo(toDo) {
            this.toDoMap.set(toDo.getID(), toDo);
            allProjects.set(uuid, this);
        },

        toJSON() {
            return {
                id: uuid,
                title: this.title,
                toDoMap: this.toDoMap
            };
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

function renderProject (projectItem, shouldFocus) {
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
    if (shouldFocus) {
        project.click();
    }
}

let renderAllProjects = (focusFirst = false) => {
    container.textContent = '';
    let isFirstProject = true;
    allProjects.forEach((projectItem => {
        renderProject(projectItem, isFirstProject && focusFirst);
        isFirstProject = false;
    }))
}

function initialize() {
    let focusFirst = false;
    const loadedProjects = loadProjects();
    
    if (loadedProjects && loadedProjects.size > 0) {
        loadedProjects.forEach((value, key) => {
            projectsStore.set(key, value);
        });
    } else {
        focusFirst = true;
        const defaultProject = createProject("First project");
        let toDo1 = createToDo("First to do", "Wonder what this is going to be about", "high", new Date());
        defaultProject.addToDo(toDo1);
    }
    renderAllProjects(focusFirst);
}

initialize();

export {
    allProjects as allProjects,
    createProject as createProject,
    renderProject
};
