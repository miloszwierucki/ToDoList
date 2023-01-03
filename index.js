const inCompleteTasks = document.getElementById("incomplete-tasks");
const CompletedTasks = document.getElementById("completed-tasks");
const addButton = document.getElementById("add-button");
const allTasks = [];

//Loacl Storage
window.onload = loadTasks;

function loadTasks() {
  if (localStorage.getItem("tasks") == null) return;
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    createNewTask(task.task, task.completed);
  });
}

//Add a new task
addButton.addEventListener("click", () => {
  const newTask = document.getElementById("new-task").value;
  if (newTask != "") {
    localStorage.setItem(
      "tasks",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("tasks") || "[]"),
        { task: newTask, completed: false },
      ])
    );
    createNewTask(newTask, false);
  }
});

const createNewTask = (newTask, completed) => {
  const newElement = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  const label = document.createElement("label");
  label.innerText = newTask;
  const editInput = document.createElement("input");
  editInput.setAttribute("type", "text");
  editInput.setAttribute("value", newTask);
  const editTask = document.createElement("button");
  editTask.classList.add("edit");
  editTask.textContent = "Edit";
  const deleteTask = document.createElement("button");
  deleteTask.classList.add("delete");
  deleteTask.textContent = "Delete";

  newElement.appendChild(checkbox);
  newElement.appendChild(label);
  newElement.appendChild(editInput);
  newElement.appendChild(editTask);
  newElement.appendChild(deleteTask);

  if (completed === false) {
    inCompleteTasks.appendChild(newElement);
    checkbox.checked = false;
  } else {
    CompletedTasks.appendChild(newElement);
    checkbox.checked = true;
  }

  allTasks.push(newElement);
  refreshTasks();
};

const refreshTasks = () => {
  allTasks.forEach((task) => {
    const editButton = task.querySelector(".edit");
    const deleteButton = task.querySelector(".delete");
    const label = task.querySelector("label");
    const editInput = task.querySelector("input[type=text]");
    const checkbox = task.querySelector("input[type=checkbox]");
    let edit = 0;

    editButton.addEventListener("click", () => {
      task.classList.toggle("editMode");
      if (edit == 0) {
        editInput.value = label.innerText;
        edit = 1;
      } else {
        label.innerText = editInput.value;
        edit = 0;
      }
      refreshStorage();
    });

    deleteButton.addEventListener("click", () => {
      allTasks.splice(allTasks.indexOf(task), 1);
      task.remove();
      refreshStorage();
    });

    checkbox.addEventListener("click", () => {
      if (checkbox.checked == true) {
        CompletedTasks.appendChild(task);
      } else {
        inCompleteTasks.appendChild(task);
      }
      refreshStorage();
    });
  });
};

const refreshStorage = () => {
  let tasks = [];
  allTasks.forEach((task) => {
    const label = task.querySelector("label");
    const checkbox = task.querySelector("input[type=checkbox]");
    tasks.push({ task: label.innerText, completed: checkbox.checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
