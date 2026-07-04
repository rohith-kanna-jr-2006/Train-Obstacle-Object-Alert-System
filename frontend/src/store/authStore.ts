import { create } from "zustand";
import { UserSession } from "@/types";

interface AuthState {
  session: UserSession;
  isAuthenticated: boolean;
  login: (username: string, role: "DRIVER" | "DISPATCHER" | "MAINTENANCE" | "ADMIN") => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: {
    token: "mock-jwt-token-xyz-123",
    user: {
      id: "USR-007",
      username: "loco_pilot_nitheesh",
      role: "DRIVER",
      name: "Pilot Nitheesh Santhi",
    },
  },
  isAuthenticated: true, // Auto login for seamless control room dashboard demo

  login: async (username, role) => {
    // Simulated authentication login
    return new Promise((resolve) => {
      setTimeout(() => {
        set({
          session: {
            token: "mock-jwt-token-user-session",
            user: {
              id: `USR-${Math.floor(100 + Math.random() * 900)}`,
              username: username.toLowerCase().replace(" ", "_"),
              role: role,
              name: username,
            },
          },
          isAuthenticated: true,
        });
        resolve(true);
      }, 500);
    });
  },

  logout: () =>
    set({
      session: {
        token: null,
        user: null,
      },
      isAuthenticated: false,
    }),
}));
