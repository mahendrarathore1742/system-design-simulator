import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface ToastData {
  message: string;
  type: ToastType;
}

interface AppState {
  selectedProblemId: string;
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeRightTab: "properties" | "simulation" | "score" | "capacity";
  theme: "dark" | "light";
  soundEnabled: boolean;
  toast: ToastData | null;

  setSelectedProblem: (id: string) => void;
  toggleLeftSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveRightTab: (tab: AppState["activeRightTab"]) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  showToast: (message: string, type: ToastType) => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedProblemId: "url-shortener",
  leftSidebarOpen: true,
  rightPanelOpen: true,
  activeRightTab: "properties",
  theme: "dark",
  soundEnabled: true,
  toast: null,

  setSelectedProblem: (id) => set({ selectedProblemId: id }),
  toggleLeftSidebar: () =>
    set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightPanel: () =>
    set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  toggleTheme: () =>
    set((s) => {
      const newTheme = s.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return { theme: newTheme };
    }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  showToast: (message, type) => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
