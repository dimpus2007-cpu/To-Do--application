/* =========================
   SELECT HTML ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const emptyState = document.getElementById("emptyState");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================
   TASK DATA
========================= */

let tasks = JSON.parse(
    localStorage.getItem("todoTasks")
) || [];

let currentFilter = "all";


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );
}


/* =========================
   ADD TASK
========================= */

function addTask() {

    const text = taskInput.value.trim();

    // Don't add empty tasks
    if (text === "") {

        taskInput.focus();

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false
    };


    tasks.push(newTask);


    saveTasks();

    taskInput.value = "";

    taskInput.focus();

    renderTasks();
}


/* =========================
   DISPLAY TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";


    // Filter tasks
    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {

            return !task.completed;
        }

        if (currentFilter === "completed") {

            return task.completed;
        }

        return true;
    });


    // Show / hide empty state
    if (filteredTasks.length === 0) {

        emptyState.classList.remove("hidden");

    } else {

        emptyState.classList.add("hidden");
    }


    // Create each task
    filteredTasks.forEach(task => {

        const taskItem = document.createElement("li");

        taskItem.className = "task-item";


        if (task.completed) {

            taskItem.classList.add("completed");
        }


        /* Checkbox */

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;


        checkbox.addEventListener(
            "change",
            () => toggleTask(task.id)
        );


        /* Task text */

        const taskText =
            document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        /* Action buttons */

        const actions =
            document.createElement("div");

        actions.className = "task-actions";


        /* Edit button */

        const editButton =
            document.createElement("button");

        editButton.className =
            "action-btn edit-btn";

        editButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4L19 9l-4-4L4 16v4z"></path>
        <path d="M13.5 6.5l4 4"></path>
    </svg>
`;

        editButton.title = "Edit task";


        editButton.addEventListener(
            "click",
            () => editTask(task.id)
        );


        /* Delete button */

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "action-btn delete-btn";

        deleteButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M6 7l1 13h10l1-13"></path>
        <path d="M9 7V4h6v3"></path>
    </svg>
`;

        deleteButton.title = "Delete task";


        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        /* Put buttons together */

        actions.appendChild(editButton);

        actions.appendChild(deleteButton);


        /* Put everything into task */

        taskItem.appendChild(checkbox);

        taskItem.appendChild(taskText);

        taskItem.appendChild(actions);


        /* Add task to list */

        taskList.appendChild(taskItem);
    });


    updateTaskCount();
}


/* =========================
   COMPLETE TASK
========================= */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });


    saveTasks();

    renderTasks();
}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();
}


/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) return;


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (newText === null) {

        return;
    }


    const cleanedText = newText.trim();


    if (cleanedText === "") {

        return;
    }


    task.text = cleanedText;


    saveTasks();

    renderTasks();
}


/* =========================
   CLEAR COMPLETED
========================= */

function clearCompleted() {

    tasks = tasks.filter(
        task => !task.completed
    );


    saveTasks();

    renderTasks();
}


/* =========================
   TASK COUNTER
========================= */

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    if (activeTasks === 1) {

        taskCount.textContent = "1 task";

    } else {

        taskCount.textContent =
            `${activeTasks} tasks`;
    }
}


/* =========================
   FILTER TASKS
========================= */

function changeFilter(filter) {

    currentFilter = filter;


    // Remove active class
    filterButtons.forEach(button => {

        button.classList.remove("active");
    });


    // Add active class to selected filter
    const selectedButton =
        document.querySelector(
            `[data-filter="${filter}"]`
        );


    selectedButton.classList.add("active");


    renderTasks();
}


/* =========================
   EVENT LISTENERS
========================= */

// Add button
addTaskBtn.addEventListener(
    "click",
    addTask
);


// Press Enter to add task
taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();
        }
    }
);


// Filter buttons
filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            changeFilter(
                button.dataset.filter
            );
        }
    );
});


// Clear completed
clearCompletedBtn.addEventListener(
    "click",
    clearCompleted
);


/* =========================
   INITIAL LOAD
========================= */

renderTasks();