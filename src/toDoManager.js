let allToDos = new Map();
let container = document.querySelector("#container");
import trashIcon from "./trash icon.svg"

function createToDo (description, priority) {
    let uuid = self.crypto.randomUUID();
    const todo = {
        description, priority,
        completed: false,

        getID() {
            return uuid;
        },

        toggle() {
            this.completed = !this.completed;
        },

        updateDescription(newDescription) {
            this.description = newDescription;
        },

        updatePriority(newPriority) {
            this.priority = newPriority
        }
    };
    allToDos.set(uuid, todo);
    return todo;
}


function renderTodo(projectItem) {
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-container');
    
    if (projectItem.toDoArray) {
        projectItem.toDoArray.forEach((todoitem) => {
            let deleteBtn = document.createElement("img");
            deleteBtn.src = trashIcon;
            deleteBtn.classList.add("delete-btn");

            let todoElement = document.createElement("div");
            todoElement.classList.add("todo-item");
            todoElement.dataset.todoid = todoitem.getID();
            
            let description = document.createElement("span");
            description.textContent = todoitem.description;
            
            let priorityBadge = document.createElement("span");
            priorityBadge.classList.add("priority", todoitem.priority);
            priorityBadge.textContent = todoitem.priority;
            
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todoitem.completed;
            checkbox.addEventListener("change", () => todoitem.toggle());
            
            let label = document.createElement("label");

            label.appendChild(checkbox);
            label.appendChild(description);
            
            todoElement.appendChild(label);
            todoElement.appendChild(priorityBadge);
            todoElement.appendChild(deleteBtn);
            
            todoContainer.appendChild(todoElement);
        });
    }
    
    return todoContainer;
}

window.addEventListener('DOMContentLoaded', () => {
    renderTodo();
});

export {
    allToDos, 
    createToDo,
    renderTodo
}