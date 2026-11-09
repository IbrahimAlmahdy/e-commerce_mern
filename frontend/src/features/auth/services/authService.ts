import api from "../../../lib/axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
}

export const loginUser = async ({
  email,
  password,
}: LoginRequest): Promise<string> => {
  const response = await api.post<string>("/user/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterRequest): Promise<string> => {
  const response = await api.post<string>("/user/register", {
    firstName,
    lastName,
    email,
    password,
  });

  return response.data;
};
