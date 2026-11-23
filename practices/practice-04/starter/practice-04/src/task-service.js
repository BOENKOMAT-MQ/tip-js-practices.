const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);
function isValidId(id) { return Number.isSafeInteger(id) && id > 0; }
function isValidTitle(title) {
  if (typeof title !== "string") return false;
  const t = title.trim();
  return t.length >= 1 && t.length <= 100;
}
export function createTask(id, title, priority = "medium") {
  if (!isValidId(id)) return { ok: false, error: "Некорректный id." };
  if (!isValidTitle(title)) return { ok: false, error: "Название: от 1 до 100 символов." };
  if (!ALLOWED_PRIORITIES.has(priority)) return { ok: false, error: "Некорректный приоритет." };
  return { ok: true, task: { id, title: title.trim(), completed: false, priority } };
}
export function findTaskById(tasks, id) { return tasks.find((task) => task.id === id); }
export function getPendingTasks(tasks) { return tasks.filter((task) => !task.completed); }
export function getTaskTitles(tasks) { return tasks.map((task) => task.title); }
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  return { total, completed, pending, progress };
}
export function addTask(tasks, id, title, priority = "medium") {
  const created = createTask(id, title, priority);
  if (!created.ok) return created;
  if (findTaskById(tasks, id)) return { ok: false, error: "id уже существует." };
  return { ok: true, tasks: [...tasks, created.task] };
}
export function setTaskCompleted(tasks, id, completed) {
  if (!isValidId(id)) return { ok: false, error: "Некорректный id." };
  if (typeof completed !== "boolean") return { ok: false, error: "completed должен быть boolean." };
  if (!findTaskById(tasks, id)) return { ok: false, error: "Задача не найдена." };
  return { ok: true, tasks: tasks.map((t) => (t.id === id ? { ...t, completed } : t)) };
}
export function renameTask(tasks, id, title) {
  if (!isValidId(id)) return { ok: false, error: "Некорректный id." };
  if (!isValidTitle(title)) return { ok: false, error: "Название: от 1 до 100 символов." };
  if (!findTaskById(tasks, id)) return { ok: false, error: "Задача не найдена." };
  const normalized = title.trim();
  return { ok: true, tasks: tasks.map((t) => (t.id === id ? { ...t, title: normalized } : t)) };
}
export function removeTask(tasks, id) {
  if (!isValidId(id)) return { ok: false, error: "Некорректный id." };
  if (!findTaskById(tasks, id)) return { ok: false, error: "Задача не найдена." };
  return { ok: true, tasks: tasks.filter((t) => t.id !== id) };
}
export function updateTask(tasks, id, title, priority) {
  if (!isValidId(id)) return { ok: false, error: "Некорректный id." };
  if (!findTaskById(tasks, id)) return { ok: false, error: "Задача не найдена." };
  if (!isValidTitle(title)) return { ok: false, error: "Название: от 1 до 100 символов." };
  if (!ALLOWED_PRIORITIES.has(priority)) return { ok: false, error: "Некорректный приоритет." };
  const normalized = title.trim();
  return { ok: true, tasks: tasks.map((t) => (t.id === id ? { ...t, title: normalized, priority } : t)) };
}