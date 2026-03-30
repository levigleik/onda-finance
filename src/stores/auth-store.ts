import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	name: string;
	email: string;
}

export const DEFAULT_INITIAL_BALANCE = 10_000;

const normalizeCurrencyValue = (value: number) =>
	Math.round((value + Number.EPSILON) * 100) / 100;

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	balance: number;
	login: (user: User) => void;
	logout: () => void;
	setBalance: (balance: number) => void;
	debitBalance: (amount: number) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			user: null,
			balance: DEFAULT_INITIAL_BALANCE,
			login: (user) =>
				set((state) => ({
					isAuthenticated: true,
					user,
					balance: Number.isFinite(state.balance)
						? normalizeCurrencyValue(state.balance)
						: DEFAULT_INITIAL_BALANCE,
				})),
			logout: () => set({ isAuthenticated: false, user: null }),
			setBalance: (balance) =>
				set({
					balance: normalizeCurrencyValue(Math.max(0, balance)),
				}),
			debitBalance: (amount) =>
				set((state) => ({
					balance: normalizeCurrencyValue(
						Math.max(0, state.balance - Math.max(0, amount)),
					),
				})),
		}),
		{
			name: "onda-finance-auth",
		},
	),
);
