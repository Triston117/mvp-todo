document.addEventListener("DOMContentLoaded", () => {
  const dayOfWeekSelect = document.getElementById("day-of-week");
  let selectedDayOfWeek = ""; // New variable to store the selected day of the week
  const dayTables = {}; // Object to store the day tables
  const taskList = document.getElementById("task-list"); // Define taskList variable

  function getOrCreateDayTable(day) {
    if (!dayTables[day]) {
      const dayTable = document.createElement("ul");
      dayTable.classList.add("day-table");
      dayTables[day] = dayTable;
    }
    return dayTables[day];
  }

  function getTasksForDay(day) {
    fetch(`/tasks/${day}`)
      .then((response) => response.json())
      .then((tasks) => {
        const dayTable = getOrCreateDayTable(day);
        dayTable.innerHTML = "";

        tasks.forEach((task) => {
          const listItem = document.createElement("li");
          listItem.dataset.taskId = task.id;

          listItem.innerHTML = `
            <input type="checkbox" id="${task.id}" name="task-${
            task.id
          }" value="${task.task}" ${task.completed ? "checked" : ""} />
            <label for="${task.id}">${task.task}</label>
            <button>Delete</button>
          `;

          dayTable.appendChild(listItem);
        });

        taskList.innerHTML = "";
        taskList.appendChild(dayTable);
      })
      .catch((error) => {
        console.error(`Error getting tasks for ${day}: ${error}`);
      });
  }

  function addTask(event) {
    event.preventDefault();

    const taskInput = document.querySelector("#new-task");
    const dayOfWeek = dayOfWeekSelect.value;
    taskInput.value = ""; // Clear the input value

    const listItem = document.createElement("li");
    listItem.dataset.taskId = Date.now();

    listItem.innerHTML = `
      <input type="checkbox" id="${listItem.dataset.taskId}" name="task-${listItem.dataset.taskId}" value="${taskInput.value}" />
      <label for="${listItem.dataset.taskId}">${taskInput.value}</label>
      <button>Delete</button>
    `;

    const dayTable = getOrCreateDayTable(dayOfWeek);
    dayTable.appendChild(listItem);

    // Send POST request to add the task
    fetch(`/tasks/${dayOfWeek}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: taskInput.value,
        completed: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Task added:", data);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }
  // test change
  function deleteTask(event) {
    if (event.target.tagName === "BUTTON") {
      const listItem = event.target.parentNode;
      const taskId = listItem.dataset.taskId;

      // Update the URL by using the selectedDayOfWeek variable
      fetch(`/tasks/${selectedDayOfWeek}/${taskId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Task deleted:", data);
          listItem.remove();
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  }

  // Add event listener for form submission
  const taskForm = document.getElementById("task-form");
  taskForm.addEventListener("submit", addTask);

  // Add event listener for delete button clicks
  taskList.addEventListener("click", deleteTask);

  // Fetch and display tasks for the selected day of the week
  dayOfWeekSelect.addEventListener("change", () => {
    selectedDayOfWeek = dayOfWeekSelect.value; // Store the selected day of the week
    getTasksForDay(selectedDayOfWeek);
  });
});
