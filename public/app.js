document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  const dayOfWeekSelect = document.getElementById("day-of-week");
  let selectedDayOfWeek = ""; // New variable to store the selected day of the week

  function getTasksForDay(day) {
    fetch(`/tasks/${day}`)
      .then((response) => response.json())
      .then((tasks) => {
        taskList.innerHTML = "";

        tasks.forEach((task) => {
          const listItem = document.createElement("li");
          listItem.classList.add(day);
          listItem.dataset.taskId = task.id;

          listItem.innerHTML = `
            <input type="checkbox" id="${task.id}" name="task-${
            task.id
          }" value="${task.task}" ${task.completed ? "checked" : ""} />
            <label for="${task.id}">${task.task}</label>
            <button>Delete</button>
          `;

          taskList.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error(`Error getting tasks for ${day}: ${error}`);
      });
  }

  function addTask(event) {
    event.preventDefault();

    const taskInput = document.querySelector("#new-task");
    const dayOfWeek = dayOfWeekSelect.value;

    const listItem = document.createElement("li");
    listItem.classList.add(dayOfWeek);
    listItem.innerHTML = `
      <input type="checkbox" id="${
        taskInput.value
      }" name="task-${Date.now()}" value="${taskInput.value}" />
      <label for="${Date.now()}">${taskInput.value}</label>
      <button>Delete</button>
    `;

    taskList.appendChild(listItem);
    taskInput.value = "";

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

  function deleteTask(event) {
    if (event.target.tagName === "BUTTON") {
      const listItem = event.target.parentNode;
      const taskId = listItem.dataset.taskId;

      // Send DELETE request to remove the task
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
