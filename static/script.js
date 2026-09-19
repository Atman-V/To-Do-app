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

// --- Fetch and render tasks ---
async function loadTasks() {
  formError.textContent = "";
  try {
    const url = currentFilter === "All" ? API_URL : `${API_URL}?status=${currentFilter}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load tasks");
    const tasks = await res.json();
    renderTasks(tasks);
    updateStats(tasks);
  } catch (err) {
    formError.textContent = "Could not load tasks. Is the server running?";
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.appendChild(emptyState);
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = `task-card priority-${task.priority}${task.status === "Completed" ? " completed" : ""}`;

    card.innerHTML = `
      <div class="task-main">
        <p class="task-title">${escapeHtml(task.title)}</p>
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ""}
        <div class="task-meta">
          <span class="badge priority-${task.priority}">${task.priority}</span>
          <span>${task.status}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="toggle-btn" data-id="${task.id}" data-status="${task.status}">
          ${task.status === "Completed" ? "Mark pending" : "Mark done"}
        </button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    taskList.appendChild(card);
  });
}

function updateStats(allVisibleTasks) {
  // Fetch full counts regardless of filter for accurate stats
  fetch(API_URL)
    .then((res) => res.json())
    .then((tasks) => {
      document.getElementById("stat-total").textContent = tasks.length;
      document.getElementById("stat-pending").textContent =
        tasks.filter((t) => t.status === "Pending").length;
      document.getElementById("stat-done").textContent =
        tasks.filter((t) => t.status === "Completed").length;
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// --- Add task ---
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.textContent = "";

  const title = inputTitle.value.trim();
  if (!title) {
    formError.textContent = "Task name is required.";
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: inputDescription.value.trim(),
        priority: inputPriority.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to add task");
    }

    inputTitle.value = "";
    inputDescription.value = "";
    inputPriority.value = "Medium";
    loadTasks();
  } catch (err) {
    formError.textContent = err.message;
  }
});

// --- Toggle status / delete (event delegation) ---
taskList.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("toggle-btn")) {
    const newStatus = e.target.dataset.status === "Completed" ? "Pending" : "Completed";
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadTasks();
  }

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Delete this task?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTasks();
  }
});

// --- Filters ---
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    loadTasks();
  });
});

// --- Init ---
loadTasks();
