import { DEFAULT_INITIAL_BALANCE } from "@/stores/auth-store";

export const TEST_NOW = new Date("2026-03-30T12:00:00-03:00");

export const TEST_AUTH_USER = {
	name: "Usuário Teste",
	email: "user@onda.com",
} as const;

export const TEST_TRANSFER_AMOUNT = 2_500;
export const TEST_SCHEDULED_DATE = "2026-03-31";
export const TEST_TRANSFER_DESCRIPTION = "repasse do projeto de março";
export const TEST_TRANSFER_DESCRIPTION_PADDED = `  ${TEST_TRANSFER_DESCRIPTION}  `;
export const TEST_INITIAL_BALANCE = DEFAULT_INITIAL_BALANCE;
export const TEST_UPDATED_BALANCE =
	TEST_INITIAL_BALANCE - TEST_TRANSFER_AMOUNT;

export const TEST_TRANSFER_FIXTURE = {
	recipientName: "Marina Costa",
	recipientEmail: "marina@onda.com",
	recipientDocument: "529.982.247-25",
	amount: TEST_TRANSFER_AMOUNT,
	description: TEST_TRANSFER_DESCRIPTION,
} as const;
