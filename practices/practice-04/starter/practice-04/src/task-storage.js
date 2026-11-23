export const STORAGE_VERSION = 1;
const ALLOWED = new Set(["low", "medium", "high"]);

function isValidTask(t) {
  return t && typeof t === "object" &&
    Number.isSafeInteger(t.id) && t.id > 0 &&
    typeof t.title === "string" && t.title.trim().length > 0 && t.title.length <= 100 &&
    typeof t.completed === "boolean" && ALLOWED.has(t.priority);
}

export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;
  const ids = new Set();
  for (const t of value) {
    if (!isValidTask(t) || ids.has(t.id)) return false;
    ids.add(t.id);
  }
  return true;
}

const copy = (list) => list.map((t) => ({ ...t }));

export function loadTasks(storage, key, fallbackTasks) {
  const fallback = Array.isArray(fallbackTasks) ? copy(fallbackTasks) : [];
  let raw;
  try { raw = storage.getItem(key); }
  catch (e) { return { ok: false, source: "fallback", tasks: fallback, error: `Чтение: ${e.message}` }; }
  
  if (raw === null) return { ok: true, source: "initial", tasks: fallback };

  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) { return { ok: false, source: "fallback", tasks: fallback, error: `JSON: ${e.message}` }; }

  if (!parsed || typeof parsed !== "object" || parsed.version !== STORAGE_VERSION) {
    return { ok: false, source: "fallback", tasks: fallback, error: "Неверная версия или схема." };
  }
  if (!isValidTaskList(parsed.tasks)) {
    return { ok: false, source: "fallback", tasks: fallback, error: "Неверная структура задач." };
  }
  return { ok: true, source: "storage", tasks: copy(parsed.tasks) };
}

export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) return { ok: false, error: "Неверный список задач." };
  try {
    storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, tasks }));
    return { ok: true };
  } catch (e) { return { ok: false, error: `Запись: ${e.message}` }; }
}

export function removeSavedTasks(storage, key) {
  try { storage.removeItem(key); return { ok: true }; }
  catch (e) { return { ok: false, error: `Удаление: ${e.message}` }; }
}