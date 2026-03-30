import { create } from "zustand";

interface BalanceSettingsState {
	isBalanceSettingsOpen: boolean;
	openBalanceSettings: () => void;
	closeBalanceSettings: () => void;
	setBalanceSettingsOpen: (open: boolean) => void;
}

export const useBalanceSettingsStore = create<BalanceSettingsState>()(
	(set) => ({
		isBalanceSettingsOpen: false,
		openBalanceSettings: () => set({ isBalanceSettingsOpen: true }),
		closeBalanceSettings: () => set({ isBalanceSettingsOpen: false }),
		setBalanceSettingsOpen: (open) => set({ isBalanceSettingsOpen: open }),
	}),
);
