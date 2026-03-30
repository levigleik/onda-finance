import { delay } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TransferParticipant {
	name: string;
	email: string;
	document?: string;
}

export type TransferStatus = "agendada" | "concluida";

export interface TransferRecord {
	id: string;
	sender: TransferParticipant;
	recipient: TransferParticipant;
	amount: number;
	transferDate: string;
	description: string;
	status: TransferStatus;
	createdAt: string;
}

interface CreateTransferInput {
	sender: TransferParticipant;
	recipient: TransferParticipant;
	amount: number;
	transferDate: string;
	description?: string;
}

interface TransfersState {
	transfers: TransferRecord[];
	createTransfer: (input: CreateTransferInput) => Promise<TransferRecord>;
	clearTransfers: () => void;
}

const resolveTransferStatus = (transferDate: string): TransferStatus => {
	const selectedDate = new Date(`${transferDate}T00:00:00`);
	const today = new Date();

	selectedDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	return selectedDate.getTime() > today.getTime() ? "agendada" : "concluida";
};

export const useTransfersStore = create<TransfersState>()(
	persist(
		(set) => ({
			transfers: [],
			createTransfer: async (input) => {
				await delay(600);
				const transfer: TransferRecord = {
					id: crypto.randomUUID(),
					sender: input.sender,
					recipient: input.recipient,
					amount: input.amount,
					transferDate: input.transferDate,
					description: input.description?.trim() ?? "",
					status: resolveTransferStatus(input.transferDate),
					createdAt: new Date().toISOString(),
				};

				set((state) => ({
					transfers: [transfer, ...state.transfers],
				}));

				return transfer;
			},
			clearTransfers: () => set({ transfers: [] }),
		}),
		{
			name: "onda-finance-transfers",
		},
	),
);
