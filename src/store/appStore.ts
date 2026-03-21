import { create } from "zustand";

interface AppState {
  selectedProblemId: string;
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeRightTab: "properties" | "simulation" | "score";

  setSelectedProblem: (id: string) => void;
  toggleLeftSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveRightTab: (tab: AppState["activeRightTab"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedProblemId: "url-shortener",
  leftSidebarOpen: true,
  rightPanelOpen: true,
  activeRightTab: "properties",

  setSelectedProblem: (id) => set({ selectedProblemId: id }),
  toggleLeftSidebar: () =>
    set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightPanel: () =>
    set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
}));
