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

  updateProfile: (payload: {
    email?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    phoneNumber?: string;
    city?: string;
    country?: string;
    additionalInfo?: string;
  }) =>
    apiFetch<{ message: string; user: User }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

// ── Dashboard & Trip API Interfaces ───────────────
export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  image?: string | null;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  city: City;
  createdAt: string;
}

export interface TripData {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverImage?: string | null;
  maxBudget?: number;
  destinationCount?: number;
  status?: "completed" | "upcoming" | "ongoing" | string;
  tripStops?: TripStop[];
  tripActivities?: any[];
  createdAt: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    topRegionalSelections: any[];
    previousTrips: TripData[];
    pagination: {
      previousTrips: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };
  };
}

export const dashboardApi = {
  getDashboard: () =>
    apiFetch<DashboardResponse>("/api/dashboard"),

  getPreviousTrips: (params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query.set(key, String(val));
        }
      });
    }
    const queryString = query.toString();
    return apiFetch<{
      success: boolean;
      message: string;
      data: TripData[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    }>(`/api/dashboard/previous-trips${queryString ? `?${queryString}` : ""}`);
  },
};

export interface CreateTripPayload {
  name: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  coverImage?: string;
  maxBudget?: number;
  location?: string;
  cityId?: string;
}

export const tripApi = {
  create: (payload: CreateTripPayload) =>
    apiFetch<{ message: string; trip: any }>("/api/trips", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createTrip: (payload: CreateTripPayload) =>
    apiFetch<{ message: string; trip: TripData }>("/api/trips", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTripById: (id: string) =>
    apiFetch<{ trip: TripData }>(`/api/trips/${id}`),

  update: (id: string, payload: Partial<CreateTripPayload>) =>
    apiFetch<{ message: string; trip: any }>(`/api/trips/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/api/trips/${id}`, {
      method: "DELETE",
    }),

  addTripStop: (tripId: string, payload: { cityId?: string; cityName?: string }) =>
    apiFetch<{ message: string; tripStop: TripStop }>(`/api/trips/${tripId}/stops`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteTripStop: (tripId: string, stopId: string) =>
    apiFetch<{ message: string }>(`/api/trips/${tripId}/stops/${stopId}`, {
      method: "DELETE",
    }),

  getCities: () =>
    apiFetch<{ cities: City[] }>("/api/trips/cities"),
};

// ── Activity API (Screen 8) ───────────────────────
export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  category: string;
  costType: string;
  costAmount: number;
  duration: string;
  rating: number;
  popularity: number;
  image?: string | null;
  cityId?: string | null;
  cityName?: string | null;
  createdAt?: string;
}

export interface TripActivityItem {
  id: string;
  tripId: string;
  activityId: string;
  cityId?: string | null;
  activity: ActivityItem;
  createdAt: string;
}

export const activityApi = {
  getActivities: (params?: {
    search?: string;
    city?: string;
    category?: string;
    costType?: string;
    duration?: string;
    sortBy?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          query.set(key, String(val));
        }
      });
    }
    const qStr = query.toString();
    return apiFetch<{ activities: ActivityItem[] }>(`/api/activities${qStr ? `?${qStr}` : ""}`);
  },

  addActivityToTrip: (payload: { tripId: string; activityId: string; cityId?: string }) =>
    apiFetch<{ message: string; tripActivity: TripActivityItem }>("/api/activities/trip", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  removeActivityFromTrip: (tripActivityId: string) =>
    apiFetch<{ message: string }>(`/api/activities/trip/${tripActivityId}`, {
      method: "DELETE",
    }),

  getTripActivities: (tripId: string) =>
    apiFetch<{ tripActivities: TripActivityItem[] }>(`/api/activities/trip/${tripId}`),
};



