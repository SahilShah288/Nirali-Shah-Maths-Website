import api, { withAdminKey } from "./client";

export async function submitEnquiry(payload) {
  const { data } = await api.post("/api/enquiry", payload);
  return data;
}

export async function fetchEnquiries() {
  const { data } = await api.get("/api/enquiry", {
    ...withAdminKey(),
  });
  return data;
}

export async function deleteAllEnquiries() {
  const { data } = await api.delete("/api/enquiry", {
    ...withAdminKey(),
  });
  return data;
}
