import { create } from "zustand";
import type { User } from "@/features/auth/types/auth.types";

const SESSION_KEY = "sbp_session_token";

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  rememberMe: boolean;
}

interface AuthActions {
  setSession: (user: User, token: string, rememberMe: boolean) => void;
  logout: () => void;
  /** Called on app boot to restore token from storage. */
  loadFromStorage: () => string | null;
  /** Returns true if the current user has the ADMIN role. */
  isAdmin: () => boolean;
  /** Returns true if the current user has the TEACHER role. */
  isTeacher: () => boolean;
}

const getStoredToken = (): string | null =>
  localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);

const clearStoredToken = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  sessionToken: null,
  rememberMe: false,

  setSession: (user, token, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, token);
    } else {
      sessionStorage.setItem(SESSION_KEY, token);
    }
    set({ user, sessionToken: token, rememberMe });
  },

  logout: () => {
    clearStoredToken();
    set({ user: null, sessionToken: null, rememberMe: false });
  },

  loadFromStorage: () => {
    const token = getStoredToken();
    if (token) {
      set({ sessionToken: token });
    }
    return token;
  },

  isAdmin: () => get().user?.role === 'ADMIN',

  isTeacher: () => get().user?.role === 'TEACHER',
}));
