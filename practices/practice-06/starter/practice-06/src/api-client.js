const BASE_URL = "http://127.0.0.1:5505/api";

async function requestJson(url, options = {}) {
  const response = await fetch(BASE_URL + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  
  if (!response.ok) {
    let errorData;
    try { errorData = await response.json(); } catch { errorData = {}; }
    const error = new Error(errorData.message || "Ошибка HTTP");
    error.kind = "http";
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function getTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.completed !== undefined) params.set("completed", String(filters.completed));
  if (filters.priority) params.set("priority", filters.priority);
  return requestJson(`/tasks?${params.toString()}`);
}

export async function createTask(title, priority) {
  return requestJson("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, priority }),
  });
}

export async function updateTask(id, title, priority) {
  return requestJson(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, priority }),
  });
}

export async function toggleTask(id, completed) {
  return requestJson(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
}

export async function removeTask(id) {
  return requestJson(`/tasks/${id}`, {
    method: "DELETE",
  });
}