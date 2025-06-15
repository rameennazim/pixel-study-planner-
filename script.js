let xp = 0;
let level = 1;
const XP_PER_TASK = 20; // You can tweak this
let XP_TO_LEVEL_UP = 100;
function startGame() {
  // Hide the welcome panel
  document.getElementById("welcome-panel").classList.add("hidden");
  // Show the main planner UI
  document.getElementById("main-app").classList.remove("hidden");
  const welcome = document.getElementById("welcome-panel");
  const mainApp = document.getElementById("main-app");

  // Hide welcome panel
  welcome.classList.add("hidden");

  // Prepare main app panel for animation
  mainApp.classList.remove("hidden");
  mainApp.classList.add("animate-in");

  // Trigger animation after 50ms
  setTimeout(() => {
    mainApp.classList.add("show");
    mainApp.classList.remove("animate-in");
  }, 50);
}
const tasks = [
  {
    task: "Read Chapter 4",
    class: "English",
    priority: "High",
    dueDate: "2025-06-15",
    status: "Incomplete",
  },
  {
    task: "Math Homework",
    class: "Math",
    priority: "Medium",
    dueDate: "2025-06-14",
    status: "Incomplete",
  },
  {
    task: "Science Project",
    class: "Biology",
    priority: "Low",
    dueDate: "2025-06-20",
    status: "Incomplete",
  },
  {
    task: "Study for Test",
    class: "History",
    priority: "High",
    dueDate: "2025-06-14",
    status: "Incomplete",
  },
];

// Convert priority to numeric value
function priorityValue(p) {
  return { High: 1, Medium: 2, Low: 3 }[p] || 4;
}

// Sort tasks
tasks.sort((a, b) => {
  const dateA = new Date(a.dueDate);
  const dateB = new Date(b.dueDate);
  if (dateA.getTime() === dateB.getTime()) {
    return priorityValue(a.priority) - priorityValue(b.priority);
  }
  return dateA - dateB;
});

// Populate the table
function populateQuestTable() {
  const tbody = document.getElementById("quest-body");
  tbody.innerHTML = "";
  tasks.forEach((task, index) => {
    const tr = document.createElement("tr");
    if (task.status === "Complete") {
      tr.classList.add("completed");
    }
    // Task Name
    const taskCell = document.createElement("td");
    const taskInput = document.createElement("input");
    taskInput.value = task.task;
    taskInput.addEventListener("input", (e) => {
      editTask(index, "task", e.target.value);
    });
    taskInput.addEventListener("blur", populateQuestTable);
    taskCell.appendChild(taskInput);
    tr.appendChild(taskCell);

    // Class Name
    const classCell = document.createElement("td");
    const classInput = document.createElement("input");
    classInput.value = task.class;
    classInput.addEventListener("input", (e) => {
      editTask(index, "class", e.target.value);
    });
    classInput.addEventListener("blur", populateQuestTable);
    classCell.appendChild(classInput);
    tr.appendChild(classCell);

    // Priority Dropdown
    const priorityCell = document.createElement("td");
    const prioritySelect = document.createElement("select");
    ["High", "Medium", "Low"].forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.text = level;
      if (task.priority === level) option.selected = true;
      prioritySelect.appendChild(option);
    });
    prioritySelect.addEventListener("change", (e) => {
      editTask(index, "priority", e.target.value);
      populateQuestTable();
      initializeDatePickers();
    });
    priorityCell.appendChild(prioritySelect);
    tr.appendChild(priorityCell);

    // Due Date Picker
    const dueDateCell = document.createElement("td");
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.value = task.dueDate;
    dueDateInput.addEventListener("change", (e) => {
      editTask(index, "dueDate", e.target.value);
      populateQuestTable();
      initializeDatePickers();
    });
    dueDateCell.appendChild(dueDateInput);
    tr.appendChild(dueDateCell);

    // Status Dropdown
    const statusCell = document.createElement("td");
    const statusSelect = document.createElement("select");
    ["Incomplete", "Complete"].forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.text = state;
      if (task.status === state) option.selected = true;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener("change", (e) => {
      const prevStatus = task.status;
      editTask(index, "status", e.target.value);

      // XP logic
      if (e.target.value === "Complete" && prevStatus !== "Complete") {
        xp += XP_PER_TASK;
      } else if (e.target.value !== "Complete" && prevStatus === "Complete") {
        xp = Math.max(0, xp - XP_PER_TASK);
      }

      updateXPBar();
      populateQuestTable();
      initializeDatePickers();
    });
    statusCell.appendChild(statusSelect);
    tr.appendChild(statusCell);

    // Delete Button
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-button";
    deleteBtn.addEventListener("click", () => {
      deleteTask(index);
    });
    deleteCell.appendChild(deleteBtn);
    tr.appendChild(deleteCell);

    tbody.appendChild(tr);
  });
  saveTasks();
}
function deleteTask(index) {
  /*const task = tasks[index];

  // If the task was completed, subtract XP (but don't go below 0)
  if (task.status === "Complete") {
    xp = Math.max(0, xp - XP_PER_TASK);
  }*/

  tasks.splice(index, 1); // Remove the task
  //sortTasks(); // Re-sort remaining tasks
  updateXPBar(); // Update XP bar
  populateQuestTable(); // Re-render table
  initializeDatePickers();
}
// Call this after animation completes
function startGame() {
  const welcome = document.getElementById("welcome-panel");
  const mainApp = document.getElementById("main-app");

  welcome.style.display = "none";
  mainApp.classList.remove("hidden");
  mainApp.classList.add("animate-in");

  setTimeout(() => {
    mainApp.classList.add("show");
    mainApp.classList.remove("animate-in");
    populateQuestTable();
    initializeDatePickers();
  }, 50);
  updateXPBar();
}
function editTask(index, field, value) {
  tasks[index][field] = value.trim();

  // Optional: re-sort after editing dueDate or priority
  if (field === "dueDate" || field === "priority") {
    tasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() === dateB.getTime()) {
        return priorityValue(a.priority) - priorityValue(b.priority);
      }
      return dateA - dateB;
    });
    updateXPBar();
  }
}
function editTask(index, field, value) {
  tasks[index][field] = value.trim();

  // Re-sort if relevant
  if (field === "dueDate" || field === "priority") {
    sortTasks();
  }
}
function updateXPBar() {
  const xpBar = document.getElementById("xp-bar");
  const levelDisplay = document.getElementById("level-display");

  const percentage = (xp / XP_TO_LEVEL_UP) * 100;
  xpBar.style.width = `${percentage}%`;

  document.getElementById("xp-label").innerText = `XP ${Math.floor(
    xp
  )}/${XP_TO_LEVEL_UP}`;

  levelDisplay.innerText = `Level ${level}`;
}
function levelUp() {
  const msg = document.getElementById("level-up-msg");
  const xpBar = document.getElementById("xp-bar");

  msg.style.display = "block";
  xpBar.classList.add("glow");

  const audio = new Audio("level-up.mp3");
  audio.play();
  // Hide after animation ends
  setTimeout(() => {
    msg.style.display = "none";
    xpBar.classList.remove("glow");
  }, 2000);
}
function toggleComplete(index, isChecked) {
  const task = tasks[index];
  const wasComplete = task.status === "Complete";

  task.status = isChecked ? "Complete" : "Incomplete";

  // Only change XP if status actually changed
  if (isChecked && !wasComplete) {
    gainXP(XP_PER_TASK);
  } else if (!isChecked && wasComplete) {
    gainXP(-XP_PER_TASK); // Optional: lose XP when unchecked
  }

  sortTasks();
  populateQuestTable();
  initializeDatePickers();
}
function gainXP(amount) {
  xp += amount;
  if (xp >= XP_TO_LEVEL_UP) {
    xp = xp - XP_TO_LEVEL_UP;
    level++;
    levelUp();
  }
  updateXPBar();
}
function gainXP(amount) {
  xp += amount;

  while (xp >= XP_TO_LEVEL_UP) {
    xp -= XP_TO_LEVEL_UP;
    level++;
    levelUp();
    XP_TO_LEVEL_UP += 20; // Increase XP needed per level if you want
  }

  updateXPBar();
}

function addNewTask() {
  tasks.push({
    task: "New Task",
    class: "Class",
    priority: "Low",
    dueDate: "2025-06-30",
    status: "Incomplete",
  });

  sortTasks();
  populateQuestTable();
  initializeDatePickers();
  updateXPBar();
}
function sortTasks() {
  tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (dateA.getTime() === dateB.getTime()) {
      return priorityValue(a.priority) - priorityValue(b.priority);
    }
    return dateA - dateB;
  });
}

function saveTasks() {
  localStorage.setItem("questTasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("questTasks");
  if (saved) tasks = JSON.parse(saved);
}
function initializeDatePickers() {
  flatpickr(".datepicker", {
    dateFormat: "Y-m-d",
    defaultDate: "today",
    theme: "dark",
  });
}
