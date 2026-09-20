const API_URL = "/api/tasks";
let currentFilter = "All";

const taskForm = document.getElementById("task-form");
const inputTitle = document.getElementById("input-title");
const inputDescription = document.getElementById("input-description");
const inputPriority = document.getElementById("input-priority");
const formError = document.getElementById("form-error");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");

async function loadTasks() {
  const url = currentFilter === "All" ? API_URL : API_URL + "?status=" + currentFilter;
  const res = await fetch(url);
  const tasks = await res.json();
  renderTasks(tasks);
  updateStats();
}

async function updateStats() {
  const res = await fetch(API_URL);
  const allTasks = await res.json();
  document.getElementById("stat-total").textContent = allTasks.length;
  document.getElementById("stat-pending").textContent = allTasks.filter(t => t.status === "Pending").length;
  document.getElementById("stat-completed").textContent = allTasks.filter(t => t.status === "Completed").length;
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.status === "Completed" ? " completed" : "");

    li.innerHTML = `
      <div>
        <p class="task-title">${task.title} <span class="task-priority priority-${task.priority}">${task.priority}</span></p>
        ${task.description ? `<p class="task-description">${task.description}</p>` : ""}
      </div>
      <div class="task-actions">
        <button class="toggle-btn" data-id="${task.id}" data-status="${task.status}">
          ${task.status === "Completed" ? "Undo" : "Done"}
        </button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  }
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = "";

  const title = inputTitle.value.trim();
  if (!title) {
    formError.textContent = "Title is required.";
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: inputDescription.value.trim(),
      priority: inputPriority.value,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    formError.textContent = data.error || "Something went wrong.";
    return;
  }

  inputTitle.value = "";
  inputDescription.value = "";
  inputPriority.value = "Medium";
  loadTasks();
});

taskList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("toggle-btn")) {
    const newStatus = e.target.dataset.status === "Completed" ? "Pending" : "Completed";
    await fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadTasks();
  }

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Delete this task?")) return;
    await fetch(API_URL + "/" + id, { method: "DELETE" });
    loadTasks();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    loadTasks();
  });
});

loadTasks();
