import client from "./client";

export const createRescue = async (rescueData) => {
  const { data } = await client.post("/rescues", rescueData);
  return data;
};

export const getAllRescues = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const { data } = await client.get(`/rescues${queryString ? `?${queryString}` : ""}`);
  return data;
};

export const getRescueById = async (id) => {
  const { data } = await client.get(`/rescues/${id}`);
  return data;
};

export const getMyRescues = async () => {
  const { data } = await client.get("/rescues/my");
  return data;
};

export const acceptRescue = async (id) => {
  const { data } = await client.put(`/rescues/${id}/accept`);
  return data;
};

export const completeRescue = async (id) => {
  const { data } = await client.put(`/rescues/${id}/complete`);
  return data;
};

export const deleteRescue = async (id) => {
  const { data } = await client.delete(`/rescues/${id}`);
  return data;
};
