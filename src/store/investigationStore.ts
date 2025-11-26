import { create } from 'zustand';

interface InvestigationState {
  currentTab: number;
  unlockedTabs: number[];
  isLoadingComplete: boolean;
  isOnBoard: boolean;
  setCurrentTab: (tab: number) => void;
  unlockTab: (tab: number) => void;
  setLoadingComplete: () => void;
  setOnBoard: (value: boolean) => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
  currentTab: 0,
  unlockedTabs: [0],
  isLoadingComplete: false,
  isOnBoard: false,
  setCurrentTab: (tab) => set({ currentTab: tab }),
  unlockTab: (tab) =>
    set((state) => ({
      unlockedTabs: [...state.unlockedTabs, tab],
    })),
  setLoadingComplete: () => set({ isLoadingComplete: true }),
  setOnBoard: (value) => set({ isOnBoard: value }),
}));
