import { delay } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TransferParticipant {
	name: string;
	email: string;
	document?: string;
}

export type TransferStatus = "scheduled" | "completed";

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

const DEFAULT_TRANSFER_SEED = [
	{
		id: "seed-transfer-01",
		sender: {
			name: "Onda Finance",
			email: "financeiro@onda.com",
		},
		recipient: {
			name: "Ana Beatriz",
			email: "ana@onda.com",
			document: "224.622.020-30",
		},
		amount: 480,
		transferDate: "2026-03-18",
		description: "reembolso de despesas do time",
		status: "completed",
		createdAt: "2026-03-18T09:30:00-03:00",
	},
	{
		id: "seed-transfer-02",
		sender: {
			name: "Onda Finance",
			email: "financeiro@onda.com",
		},
		recipient: {
			name: "Carlos Henrique",
			email: "carlos@onda.com",
			document: "250.939.830-04",
		},
		amount: 1_250,
		transferDate: "2026-03-25",
		description: "repasse operacional",
		status: "completed",
		createdAt: "2026-03-25T14:10:00-03:00",
	},
	{
		id: "seed-transfer-03",
		sender: {
			name: "Onda Finance",
			email: "financeiro@onda.com",
		},
		recipient: {
			name: "Marina Souza",
			email: "marina.souza@onda.com",
			document: "885.638.750-60",
		},
		amount: 890,
		transferDate: "2026-03-30",
		description: "adiantamento de projeto",
		status: "completed",
		createdAt: "2026-03-30T10:20:00-03:00",
	},
	{
		id: "seed-transfer-04",
		sender: {
			name: "Onda Finance",
			email: "financeiro@onda.com",
		},
		recipient: {
			name: "Gabriela Lima",
			email: "gabriela@onda.com",
			document: "904.199.380-01",
		},
		amount: 1_700,
		transferDate: "2026-04-03",
		description: "pagamento agendado de fornecedor",
		status: "scheduled",
		createdAt: "2026-03-30T15:45:00-03:00",
	},
] satisfies ReadonlyArray<TransferRecord>;

export { DEFAULT_TRANSFER_SEED };

const normalizeTransferStatus = (
	status: string | undefined,
	transferDate: string,
): TransferStatus => {
	switch (status) {
		case "agendada":
		case "scheduled":
			return "scheduled";
		case "concluida":
		case "completed":
			return "completed";
		default:
			return resolveTransferStatus(transferDate);
	}
};

const resolveTransferStatus = (transferDate: string): TransferStatus => {
	const selectedDate = new Date(`${transferDate}T00:00:00`);
	const today = new Date();

	selectedDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	return selectedDate.getTime() > today.getTime() ? "scheduled" : "completed";
};

const cloneTransferRecord = (transfer: TransferRecord): TransferRecord => ({
	...transfer,
	sender: { ...transfer.sender },
	recipient: { ...transfer.recipient },
});

const createDefaultTransfers = () =>
	DEFAULT_TRANSFER_SEED.map((transfer) => cloneTransferRecord(transfer));

const normalizeTransferRecord = (transfer: TransferRecord): TransferRecord => ({
	...transfer,
	sender: { ...transfer.sender },
	recipient: { ...transfer.recipient },
	status: normalizeTransferStatus(transfer.status, transfer.transferDate),
});

const mergeTransfersWithDefaultSeed = (transfers: TransferRecord[] = []) => {
	const normalizedTransfers = transfers.map((transfer) =>
		normalizeTransferRecord(transfer),
	);
	const existingIds = new Set(
		normalizedTransfers.map((transfer) => transfer.id),
	);
	const missingDefaultTransfers = createDefaultTransfers().filter(
		(transfer) => !existingIds.has(transfer.id),
	);

	return [...normalizedTransfers, ...missingDefaultTransfers];
};

export const useTransfersStore = create<TransfersState>()(
	persist(
		(set) => ({
			transfers: createDefaultTransfers(),
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
			clearTransfers: () => set({ transfers: createDefaultTransfers() }),
		}),
		{
			name: "onda-finance-transfers",
			version: 2,
			migrate: (persistedState) => {
				const state = persistedState as Partial<TransfersState>;

				return {
					...state,
					transfers: mergeTransfersWithDefaultSeed(state.transfers),
				};
			},
		},
	),
);
