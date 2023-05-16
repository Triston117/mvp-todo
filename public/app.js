document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  const dayOfWeekSelect = document.getElementById("day-of-week");

  function getTasksForDay(day) {
    fetch(`/tasks/${day}`)
      .then((response) => response.json())
      .then((tasks) => {
        taskList.innerHTML = "";

        tasks.forEach((task) => {
          const listItem = document.createElement("li");
          listItem.classList.add(day);
          listItem.dataset.taskId = task.id; // Set the task ID as a data attribute

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
      // Update the fetch request URL
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
      const taskId = listItem.dataset.taskId; // Retrieve the task ID from the data attribute

      // Send DELETE request to remove the task
      fetch(`/tasks/${dayOfWeek}/${taskId}`, {
        // Update the fetch request URL
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
    const selectedDay = dayOfWeekSelect.value;
    getTasksForDay(selectedDay);
  });
});
