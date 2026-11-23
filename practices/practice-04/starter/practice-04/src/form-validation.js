const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  const source = draft ?? {};
  let id;

  if (editingId !== null) {
    id = editingId;
    if (!Number.isSafeInteger(id) || id <= 0 || !tasks.some((t) => t.id === id)) {
      errors.id = "Задача для редактирования не найдена.";
    }
  } else {
    const raw = source.id;
    const num =
      typeof raw === "number" ? raw
      : typeof raw === "string" && raw.trim() !== "" ? Number(raw)
      : NaN;
    if (!Number.isSafeInteger(num) || num <= 0) {
      errors.id = "Идентификатор — положительное целое число.";
    } else if (tasks.some((t) => t.id === num)) {
      errors.id = "Задача с таким идентификатором уже есть.";
    } else {
      id = num;
    }
  }

  const rawTitle = source.title;
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  if (title.length === 0) errors.title = "Название не должно быть пустым.";
  else if (title.length > 100) errors.title = "Название не длиннее 100 символов.";

  const priority = source.priority;
  if (!ALLOWED_PRIORITIES.has(priority)) errors.priority = "Недопустимый приоритет.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { id, title, priority } };
}