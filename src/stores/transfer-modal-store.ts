import { create } from "zustand";

interface TransferModalState {
	isTransferModalOpen: boolean;
	openTransferModal: () => void;
	closeTransferModal: () => void;
	setTransferModalOpen: (open: boolean) => void;
}

export const useTransferModalStore = create<TransferModalState>()((set) => ({
	isTransferModalOpen: false,
	openTransferModal: () => set({ isTransferModalOpen: true }),
	closeTransferModal: () => set({ isTransferModalOpen: false }),
	setTransferModalOpen: (open) => set({ isTransferModalOpen: open }),
}));
