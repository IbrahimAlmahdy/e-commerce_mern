import { create } from "zustand";

interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const USERNAME_KEY = "username";
const TOKEN_KEY = "token";

const initialUsername = localStorage.getItem(USERNAME_KEY);
const initialToken = localStorage.getItem(TOKEN_KEY);

export const useAuth = create<AuthState>((set) => ({
  username: initialUsername,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),

  login: (username, token) => {
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TOKEN_KEY, token);

    set({
      username,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);

    set({
      username: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
