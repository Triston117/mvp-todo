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

  // Send a POST request to add the task
  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ day: dayOfWeek, task: taskInput.value }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error adding task");
      }
    })
    .catch((error) => {
      console.error(`Error adding task: ${error}`);
    });
}

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

  async function showTasks(day) {
    try {
      const response = await fetch(`/tasks/${day}`);
      const tasks = await response.json();

      taskList.innerHTML = "";

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
    } catch (error) {
      console.log(`Error fetching tasks for ${day}: ${error}`);
    }
  }

  function addTask(event) {
    event.preventDefault();

    const newTask = document.createElement("li");
    const taskInput = document.querySelector("#new-task");
    const dayOfWeek = dayOfWeekSelect.value;

    newTask.innerHTML = `
      <input type="checkbox" id="${taskInput.value}" name="${taskInput.value}" value="${taskInput.value}" />
      <label for="${taskInput.value}">${taskInput.value}</label>
      <button>Delete</button>
    `;

    const list = document.querySelector(`#${dayOfWeek}-list`);
    list.appendChild(newTask);
    form.reset();

    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day: dayOfWeek, task: taskInput.value }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error adding task");
        }
      })
      .catch((error) => {
        console.error(`Error adding task: ${error}`);
      });
  }

  dayOfWeekSelect.addEventListener("change", (event) => {
    const selectedDay = event.target.value;
    showTasks(selectedDay);
  });

  const form = document.querySelector("#task-form");
  form.addEventListener("submit", addTask);

  const defaultSelectedDay = dayOfWeekSelect.value;
  showTasks(defaultSelectedDay);
});
