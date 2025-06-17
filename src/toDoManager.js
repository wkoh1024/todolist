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

function deleteToDoBtn (e) {
    let node = e.target.parentNode;
    node.remove();
}


function renderTodo(projectItem) {
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-container');
    
    if (projectItem.toDoArray) {
        projectItem.toDoArray.forEach((todoitem) => {
            let deleteBtn = document.createElement("img");
            deleteBtn.src = trashIcon;
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", deleteToDoBtn);

            let todoElement = document.createElement("div");
            todoElement.classList.add("todo-item");
            todoElement.dataset.todoid = todoitem.getID();
            
            let description = document.createElement("span");
            description.textContent = todoitem.description;
            
            
            let priorityBadge = document.createElement("select");
            let highPriority = document.createElement("option");
            highPriority.value = "high";
            highPriority.textContent = "High";

            let mediumPriority = document.createElement("option");
            mediumPriority.value = "medium";
            mediumPriority.textContent = "Medium";

            let lowPriority = document.createElement("option");
            lowPriority.value = "low";
            lowPriority.textContent = "Low";

            priorityBadge.appendChild(highPriority);
            priorityBadge.appendChild(mediumPriority);
            priorityBadge.appendChild(lowPriority);

            priorityBadge.value = todoitem.priority;
            
            priorityBadge.classList.add("priority", todoitem.priority);
            
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