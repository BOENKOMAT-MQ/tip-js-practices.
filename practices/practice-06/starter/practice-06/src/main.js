import { getTasks, createTask, updateTask, toggleTask, removeTask } from "./api-client.js";
import { renderTaskList, renderEmptyState } from "./task-view.js";
import { validateTaskDraft } from "./form-validation.js";

const elements = {
  list: document.querySelector("#task-list"),
  empty: document.querySelector("#empty-message"),
  form: document.querySelector("#task-form"),
  idInput: document.querySelector("#task-id"),
  titleInput: document.querySelector("#task-title"),
  priorityInput: document.querySelector("#task-priority"),
  submitButton: document.querySelector("#form-submit"),
  cancelButton: document.querySelector("#cancel-edit"),
  resetButton: document.querySelector("#reset-data"),
  message: document.querySelector("#operation-message"),
};

let currentTasks = [];
let editingId = null;

async function loadApp() {
  try {
    elements.message.textContent = "Загрузка...";
    const res = await getTasks();
    currentTasks = res.data;
    renderApp();
    elements.message.textContent = "";
  } catch (error) {
    elements.message.textContent = `Ошибка загрузки: ${error.message}`;
  }
}

function renderApp() {
  renderTaskList(elements.list, currentTasks);
  renderEmptyState(elements.empty, currentTasks.length);
}

function setFormMode(id = null) {
  if (id === null) {
    editingId = null;
    elements.form.reset();
    elements.idInput.disabled = false;
    elements.submitButton.textContent = "Добавить задачу";
    if (elements.cancelButton) elements.cancelButton.hidden = true;
  } else {
    const task = currentTasks.find((t) => t.id === id);
    if (!task) return;
    editingId = id;
    elements.idInput.value = task.id;
    elements.idInput.disabled = true;
    elements.titleInput.value = task.title;
    elements.priorityInput.value = task.priority;
    elements.submitButton.textContent = "Сохранить изменения";
    if (elements.cancelButton) elements.cancelButton.hidden = false;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const draft = {
    title: elements.titleInput.value,
    priority: elements.priorityInput.value,
  };
  
  const check = validateTaskDraft(draft, currentTasks, editingId);
  if (!check.ok) {
    elements.message.textContent = Object.values(check.errors)[0];
    return;
  }

  try {
    elements.message.textContent = "Сохранение...";
    if (editingId === null) {
      await createTask(check.value.title, check.value.priority);
    } else {
      await updateTask(editingId, check.value.title, check.value.priority);
    }
    await loadApp();
    setFormMode(null);
    elements.message.textContent = "Успешно сохранено.";
  } catch (error) {
    elements.message.textContent = `Ошибка: ${error.message}`;
  }
}

async function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.closest("[data-task-id]").dataset.taskId);
  const action = button.dataset.action;

  if (action === "edit") {
    setFormMode(id);
    return;
  }

  try {
    elements.message.textContent = "Обработка...";
    if (action === "toggle") {
      const task = currentTasks.find((t) => t.id === id);
      await toggleTask(id, !task.completed);
    } else if (action === "delete") {
      await removeTask(id);
    }
    await loadApp();
    if (editingId === id && action === "delete") setFormMode(null);
    elements.message.textContent = "Готово.";
  } catch (error) {
    elements.message.textContent = `Ошибка: ${error.message}`;
  }
}

elements.form.addEventListener("submit", handleFormSubmit);
if (elements.cancelButton) elements.cancelButton.addEventListener("click", () => setFormMode(null));
elements.list.addEventListener("click", handleListClick);

loadApp();