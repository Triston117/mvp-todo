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
