import trashIcon from "./trash icon.svg"
import { allProjects } from "./projectManager";

function createToDo (title, description, priority, dueDate) {
    let uuid = self.crypto.randomUUID();
    const todo = {
        title,
        description,
        priority,
        dueDate,
        completed: false,

        getID() {
            return uuid;
        },

        toggle() {
            this.completed = !this.completed;
        },

        update(data) {
            Object.assign(this, data);
        }
    };
    return todo;
}

function deleteToDo (e) {
    // delete from DOM
    let toDoItem = e.target.parentNode;
    let toDoItemID = toDoItem.dataset.todoid;
    let projectID = e.target.closest('.project').dataset.projectid;

    toDoItem.remove();
    
    // delete from map
    let projectItem = allProjects.get(projectID);
    projectItem.getToDoMap().delete(toDoItemID);
}

function deleteBtnKeyboardInteraction (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.target.click();
  }
}

function renderTodo(todoitem) {
    let deleteBtn = document.createElement("img");
    deleteBtn.src = trashIcon;
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", deleteToDo);
    deleteBtn.tabIndex = 0;
    deleteBtn.addEventListener('keydown', deleteBtnKeyboardInteraction);

    let todoElement = document.createElement("div");
    todoElement.classList.add("todo-item");
    todoElement.dataset.todoid = todoitem.getID();
    
    let title = document.createElement("span");
    title.textContent = todoitem.title;
    title.classList.add("todo-title");
    title.contentEditable= "plaintext-only";
    title.addEventListener("blur", e => {
        if (todoitem.title !== e.target.textContent) {
            todoitem.update({ title: e.target.textContent });
        }
    })

    let description = document.createElement("textarea");
    description.placeholder = "Click to add a description";
    description.classList.add("todo-description");
    description.value = todoitem.description;
    description.style.overflow = 'hidden';
    description.rows = 1;
    
    const autoResize = (e) => {
        e.style.height = 'auto';
        const computedStyle = window.getComputedStyle(e);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        e.style.height = (e.scrollHeight - paddingTop - paddingBottom) + 'px';
    };

    description.addEventListener("input", () => autoResize(description));

    description.addEventListener("blur", e => {
        if (todoitem.description !== e.target.value) {
            todoitem.update({ description: e.target.value });
        }
    });

    setTimeout(() => {
        autoResize(description);
    }, 0);

    let titleAndDesc = document.createElement("div");
    titleAndDesc.appendChild(title);
    titleAndDesc.appendChild(description); 
    
    let dueDate = document.createElement("input");
    dueDate.type = "date";
    dueDate.valueAsDate = todoitem.dueDate;
    dueDate.addEventListener("blur", e => {
        const newDate = e.target.value;
        todoitem.update({ dueDate: newDate });
    });

    let priorityBadge = document.createElement("select");

    let dueDateAndPriority = document.createElement("div");
    dueDateAndPriority.appendChild(dueDate);
    dueDateAndPriority.appendChild(priorityBadge);

    let highPriority = document.createElement("option");
    highPriority.value = "high";
    highPriority.textContent = "High";

    let mediumPriority = document.createElement("option");
    mediumPriority.value = "medium";
    mediumPriority.textContent = "Medium";

    let lowPriority = document.createElement("option");
    lowPriority.value = "low";
    lowPriority.textContent = "Low";

    priorityBadge.addEventListener("change", e => {
        todoitem.update({ priority: e.target.value });
    });

    priorityBadge.appendChild(highPriority);
    priorityBadge.appendChild(mediumPriority);
    priorityBadge.appendChild(lowPriority);

    priorityBadge.value = todoitem.priority;
    
    priorityBadge.classList.add("priority");
    
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todoitem.completed;
    checkbox.addEventListener("change", () => todoitem.toggle());
    
    todoElement.appendChild(checkbox);
    todoElement.appendChild(titleAndDesc);
    todoElement.appendChild(dueDateAndPriority);
    todoElement.appendChild(deleteBtn);
    
    return todoElement;
}

export {
    createToDo,
    renderTodo
}