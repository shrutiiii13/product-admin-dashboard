import api from "@/lib/axios";
import { saveAuth } from "@/utils/auth";

export async function loginUser(username, password) {
  const response = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  const data = response.data;
  const token = data.accessToken || data.token;

  if (!token) {
    throw { friendlyMessage: "Login succeeded but no token was returned." };
  }

  saveAuth(token, {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
  });

  return data;
}
