const inCompleteTasks = document.getElementById("incomplete-tasks");
const CompletedTasks = document.getElementById("completed-tasks");
const addButton = document.getElementById("add-button");
const checkAllButton = document.getElementById("check-all-button");
const allTasks = [];

//Local Storage
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

//Refresh tasks
const refreshTasks = () => {
  const editButton = document.querySelectorAll(".edit");
  const deleteButton = document.querySelectorAll(".delete");
  const checkboxInput = document.querySelectorAll("input[type=checkbox]");

  //edit task
  editButton.forEach((button) => {
    button.addEventListener("click", () => {
      const task = button.parentElement;
      const editInput = task.querySelector("input[type=text]");
      const label = task.querySelector("label");
      const containsClass = task.classList.contains("editMode");

      task.classList.toggle("editMode");
      if (containsClass) {
        label.innerText = editInput.value;
      } else {
        editInput.value = label.innerText;
      }
      refreshStorage();
    });
  });

  //delete task
  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      const task = button.parentElement;
      allTasks.splice(allTasks.indexOf(task), 1);
      task.remove();
      refreshStorage();
    });
  });

  //check task
  checkboxInput.forEach((box) => {
    box.addEventListener("click", () => {
      const task = box.parentElement;
      if (box.checked == true) {
        CompletedTasks.appendChild(task);
      } else {
        inCompleteTasks.appendChild(task);
      }
      refreshStorage();
    });
  });
};

//Check all tasks
checkAllButton.addEventListener("click", () => {
  allTasks.forEach((task) => {
    const checkbox = task.querySelector("input[type=checkbox]");
    checkbox.checked = true;
    CompletedTasks.appendChild(task);
  });
  refreshStorage();
});

//Refresh Local Storage
const refreshStorage = () => {
  let tasks = [];
  allTasks.forEach((task) => {
    const label = task.querySelector("label");
    const checkbox = task.querySelector("input[type=checkbox]");
    tasks.push({ task: label.innerText, completed: checkbox.checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
