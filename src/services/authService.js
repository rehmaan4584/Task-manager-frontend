import { api } from "./api";

export const signupUser = async (credentials) => {
  const res = await api.post("/auth/register", credentials);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};
