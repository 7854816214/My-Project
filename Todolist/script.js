const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addBtn = document.getElementById("add-task-btn");

// Filter buttons
const allBtn = document.getElementById("all-btn");
const pendingBtn = document.getElementById("pending-btn");
const completedBtn = document.getElementById("completed-btn");

// Add task
addBtn.addEventListener("click", addTask);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = inputBox.value.trim();
  if (!taskText) {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");

  const span = document.createElement("span");
  span.classList.add("task-text", "pending");
  span.textContent = taskText;

  span.addEventListener("click", () => {
    span.classList.toggle("checked");
    span.classList.toggle("pending");
    saveData();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => {
    const newTask = prompt("Edit your task:", span.textContent);
    if (newTask !== null && newTask.trim() !== "") {
      span.textContent = newTask;
      saveData();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveData();
  });

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  listContainer.appendChild(li);
  inputBox.value = "";
  saveData();
}

// Save tasks
function saveData() {
  localStorage.setItem("todoList", listContainer.innerHTML);
}

// Load tasks
function showTasks() {
  const savedTasks = localStorage.getItem("todoList");
  if (savedTasks) listContainer.innerHTML = savedTasks;

  // Rebind events
  document.querySelectorAll(".task-text").forEach(span => {
    span.addEventListener("click", () => {
      span.classList.toggle("checked");
      span.classList.toggle("pending");
      saveData();
    });
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.remove();
      saveData();
    });
  });
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const span = btn.parentElement.querySelector(".task-text");
      const newTask = prompt("Edit your task:", span.textContent);
      if (newTask !== null && newTask.trim() !== "") {
        span.textContent = newTask;
        saveData();
      }
    });
  });
}

showTasks();

// Filter tasks
allBtn.addEventListener("click", () => filterTasks("all"));
pendingBtn.addEventListener("click", () => filterTasks("pending"));
completedBtn.addEventListener("click", () => filterTasks("completed"));

function filterTasks(status) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));

  if (status === "all") allBtn.classList.add("active");
  if (status === "pending") pendingBtn.classList.add("active");
  if (status === "completed") completedBtn.classList.add("active");

  document.querySelectorAll("#list-container li").forEach(li => {
    const taskSpan = li.querySelector(".task-text");
    if (status === "all") {
      li.style.display = "flex";
    } else if (status === "pending" && taskSpan.classList.contains("pending")) {
      li.style.display = "flex";
    } else if (status === "completed" && taskSpan.classList.contains("checked")) {
      li.style.display = "flex";
    } else {
      li.style.display = "none";
    }
  });
}
