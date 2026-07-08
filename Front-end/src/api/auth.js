import client from "./client";

export const register = async (userData) => {
  const { data } = await client.post("/auth/register", userData);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const login = async (credentials) => {
  const { data } = await client.post("/auth/login", credentials);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const getMe = async () => {
  const { data } = await client.get("/auth/me");
  return data.user;
};

export const logout = async () => {
  try {
    await client.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};