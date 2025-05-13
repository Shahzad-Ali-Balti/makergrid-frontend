// utils/token.ts

const ACCESS_TOKEN_KEY = "access_token";

// ⛳ Get access token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// ✅ Set access token
export const setToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// 🗑 Clear token (e.g. on logout)
export const clearToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
