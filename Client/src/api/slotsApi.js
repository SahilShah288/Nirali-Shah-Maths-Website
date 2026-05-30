import api, { withAdminKey } from "./client";

export async function fetchSlots() {
  const { data } = await api.get("/api/slots");
  return data;
}

export async function bookSlot(slotId, studentName) {
  const { data } = await api.post("/api/slots/book", { slotId, studentName });
  return data;
}

export async function createSlot(date, time) {
  const { data } = await api.post("/api/slots/admin", { date, time }, {
    ...withAdminKey(),
  });
  return data;
}

export async function updateSlot(id, payload) {
  const { data } = await api.patch(`/api/slots/${id}`, payload, {
    ...withAdminKey(),
  });
  return data;
}

export async function deleteSlot(id) {
  const { data } = await api.delete(`/api/slots/${id}`, {
    ...withAdminKey(),
  });
  return data;
}
