import { getTaskStats } from "./task-service.js";

const PRIORITY_LABELS = { low: "Низкий", medium: "Средний", high: "Высокий" };

export function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-card";
  li.dataset.taskId = String(task.id);
  if (task.completed) li.classList.add("is-completed");

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;
  li.append(title);

  const priority = document.createElement("p");
  priority.className = "task-priority";
  priority.textContent = PRIORITY_LABELS[task.priority] ?? task.priority;
  li.append(priority);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  for (const action of ["toggle", "edit", "delete"]) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action;

    const label = document.createElement("span");
    label.className = "action-label";
    if (action === "toggle") label.textContent = task.completed ? "Вернуть в работу" : "Завершить";
    else if (action === "edit") label.textContent = "Изменить";
    else label.textContent = "Удалить";

    button.append(label);
    actions.append(button);
  }
  li.append(actions);
  return li;
}

export function renderTaskList(listElement, tasks) {
  listElement.replaceChildren();
  for (const task of tasks) listElement.append(createTaskElement(task));
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  const stats = getTaskStats(tasks);
  const values = {
    total: String(stats.total),
    completed: String(stats.completed),
    pending: String(stats.pending),
    progress: `${stats.progress.toFixed(1)}%`,
    visible: String(visibleCount),
  };
  for (const [name, value] of Object.entries(values)) {
    const node = summaryElement.querySelector(`[data-stat="${name}"]`);
    if (node) node.textContent = value;
  }
}

export function renderEmptyState(messageElement, total, visibleCount) {
  if (total === 0) {
    messageElement.textContent = "Список задач пуст.";
    messageElement.hidden = false;
  } else if (visibleCount === 0) {
    messageElement.textContent = "Нет задач по выбранному фильтру.";
    messageElement.hidden = false;
  } else {
    messageElement.textContent = "";
    messageElement.hidden = true;
  }
}