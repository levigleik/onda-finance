import { create } from "zustand";

export interface TransferModalRecipientPreset {
	name: string;
	email: string;
	document?: string;
}

export type TransferModalInitialStep = 1 | 2;

interface OpenTransferModalOptions {
	recipientPreset?: TransferModalRecipientPreset;
	initialStep?: TransferModalInitialStep;
}

interface TransferModalState {
	isTransferModalOpen: boolean;
	recipientPreset: TransferModalRecipientPreset | null;
	initialStep: TransferModalInitialStep;
	openTransferModal: (options?: OpenTransferModalOptions) => void;
	closeTransferModal: () => void;
	setTransferModalOpen: (open: boolean) => void;
}

const defaultTransferModalState = {
	isTransferModalOpen: false,
	recipientPreset: null,
	initialStep: 1 as const,
};

export const useTransferModalStore = create<TransferModalState>()((set) => ({
	...defaultTransferModalState,
	openTransferModal: (options) =>
		set({
			isTransferModalOpen: true,
			recipientPreset: options?.recipientPreset ?? null,
			initialStep: options?.initialStep ?? 1,
		}),
	closeTransferModal: () => set(defaultTransferModalState),
	setTransferModalOpen: (open) =>
		set(open ? { isTransferModalOpen: true } : defaultTransferModalState),
}));
