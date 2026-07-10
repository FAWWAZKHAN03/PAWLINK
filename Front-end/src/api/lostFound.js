import client from "./client";

export const createReport = async (reportData) => {
  const { data } = await client.post("/lost-found", reportData);
  return data;
};

export const getAllReports = async (params = {}) => {
  const { data } = await client.get("/lost-found", { params });
  return data;
};

export const getReportById = async (id) => {
  const { data } = await client.get(`/lost-found/${id}`);
  return data;
};

export const getMyReports = async () => {
  const { data } = await client.get("/lost-found/my");
  return data;
};

export const updateReport = async (id, reportData) => {
  const { data } = await client.put(`/lost-found/${id}`, reportData);
  return data;
};

export const markAsReunited = async (id) => {
  const { data } = await client.put(`/lost-found/${id}/reunited`);
  return data;
};

export const deleteReport = async (id) => {
  const { data } = await client.delete(`/lost-found/${id}`);
  return data;
};
