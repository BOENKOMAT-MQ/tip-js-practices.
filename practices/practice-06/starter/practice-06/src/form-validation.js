export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  let id = null;

  if (editingId === null) {
    if (draft.id !== undefined && draft.id !== "") {
      id = Number(draft.id);
    }
  } else {
    id = editingId;
  }

  const rawTitle = draft.title;
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  if (title.length === 0) errors.title = "Название не должно быть пустым.";
  else if (title.length > 100) errors.title = "Название не длиннее 100 символов.";

  const priority = draft.priority;
  if (!["low", "medium", "high"].includes(priority)) errors.priority = "Недопустимый приоритет.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { id, title, priority } };
}