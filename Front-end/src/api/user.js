import client from "./client";

export const getProfile = async () => {
  const { data } = await client.get("/users/profile");
  return data;
};

export const updateProfile = async (profile) => {
  const { data } = await client.put("/users/profile", profile);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const updatePassword = async (passwords) => {
  const { data } = await client.put("/users/password", passwords);
  return data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await client.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const deleteAvatar = async () => {
  const { data } = await client.delete("/users/avatar");

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};