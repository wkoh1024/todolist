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
    return todo;
}

function deleteToDoBtn (e) {
    let node = e.target.parentNode;
    node.remove();
}

function deleteBtnKeyboardInteraction (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.target.click();
  }
}


function renderTodo(projectItem) {
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-container');
    
    if (!(projectItem.toDoArray === undefined)) {
        projectItem.toDoArray.forEach((todoitem) => {
            let deleteBtn = document.createElement("img");
            deleteBtn.src = trashIcon;
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", deleteToDoBtn);
            deleteBtn.tabIndex = 0;
            deleteBtn.addEventListener('keydown', deleteBtnKeyboardInteraction);

            let todoElement = document.createElement("div");
            todoElement.classList.add("todo-item");
            todoElement.dataset.todoid = todoitem.getID();
            
            let description = document.createElement("span");
            description.textContent = todoitem.description;
            description.contentEditable = true;
            
            
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
            
            todoElement.appendChild(checkbox);
            todoElement.appendChild(description);
            todoElement.appendChild(priorityBadge);
            todoElement.appendChild(deleteBtn);
            
            todoContainer.appendChild(todoElement);
        });
    }
    
    return todoContainer;
}




export {
    createToDo,
    renderTodo
}