/**
 * GlobeTrotter API Client
 * Central layer for all backend communication.
 */

const BASE_URL = "";

// ── Token helpers ──────────────────────────────────
export const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("gt_token") : null;

export const setToken = (token: string) =>
  localStorage.setItem("gt_token", token);

export const removeToken = () => localStorage.removeItem("gt_token");

export const setUser = (user: User) =>
  localStorage.setItem("gt_user", JSON.stringify(user));

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("gt_user");
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
  removeToken();
  localStorage.removeItem("gt_user");
};

export const isAuthenticated = (): boolean => !!getToken();

// ── Types ──────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  photoUrl?: string | null;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  city?: string | null;
  country?: string | null;
  additionalInfo?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

// ── Core fetch wrapper ─────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  const contentType = res.headers.get("content-type") || "";
  let data: any = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch (e) {
      // JSON parsing failed
    }
  } else {
    try {
      const text = await res.text();
      data = { error: text || res.statusText || "Request failed" };
    } catch (e) {
      // Reading text failed
    }
  }

  if (!res.ok) {
    const errMsg = data?.error || `Request failed with status ${res.status}`;
    throw new Error(errMsg);
  }

  return data as T;
}

// ── Auth API ───────────────────────────────────────
export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signup: (payload: SignupPayload) =>
    apiFetch<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => apiFetch<{ user: User }>("/api/auth/me"),

  forgotPassword: (email: string) =>
    apiFetch<{ message: string; resetToken?: string }>(
      "/api/auth/forgot-password",
      { method: "POST", body: JSON.stringify({ email }) }
    ),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};
