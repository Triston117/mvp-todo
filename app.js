function addTask(event) {
  event.preventDefault();

  const newTask = document.createElement("li");
  const taskInput = document.querySelector("#new-task");
  const dayOfWeek = document.querySelector("#day-of-week").value;

  newTask.innerHTML = `
      <input type="checkbox" id="${taskInput.value}" name="${taskInput.value}" value="${taskInput.value}" />
      <label for="${taskInput.value}">${taskInput.value}</label>
      <button>Delete</button>
    `;

  const list = document.querySelector(`#${dayOfWeek}-list`);
  list.appendChild(newTask);
  form.reset();
}

// app.js

document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");

  function getTasksForDay(day) {
    fetch(`/tasks/${day}`)
      .then((response) => response.json())
      .then((tasks) => {
        taskList.innerHTML = ""; // Clear existing tasks

        tasks.forEach((task) => {
          const listItem = document.createElement("li");
          listItem.classList.add(day);
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

  const dayOfWeekSelect = document.getElementById("day-of-week");

  dayOfWeekSelect.addEventListener("change", () => {
    const selectedDay = dayOfWeekSelect.value;
    getTasksForDay(selectedDay);
  });

  // Initialize with the tasks for the default selected day
  const defaultSelectedDay = dayOfWeekSelect.value;
  getTasksForDay(defaultSelectedDay);
});

// get tasks for a particular day and display them on the page
async function showTasks(day) {
  try {
    const response = await fetch(`/tasks/${day}`);
    const tasks = await response.json();

    // get the task list element
    const taskList = document.querySelector("#task-list");

    // remove any existing tasks for this day
    const existingTasks = document.querySelectorAll(`.${day}`);
    existingTasks.forEach((task) => task.remove());

    // add the new tasks to the list
    tasks.forEach((task) => {
      const newTask = document.createElement("li");
      newTask.classList.add(day);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `task-${task.id}`;
      checkbox.name = `task-${task.id}`;
      checkbox.value = `task-${task.id}`;
      const label = document.createElement("label");
      label.for = `task-${task.id}`;
      label.textContent = task.task;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      newTask.append(checkbox, label, deleteButton);
      taskList.append(newTask);
    });
  } catch (error) {
    console.log(`Error fetching tasks for ${day}: ${error}`);
  }
}

// update task list when day of week is changed
const dayOfWeekSelect = document.querySelector("#day-of-week");
dayOfWeekSelect.addEventListener("change", (event) => {
  const selectedDay = event.target.value;
  showTasks(selectedDay);
});
