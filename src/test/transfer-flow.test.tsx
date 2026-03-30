import { screen, within } from "@testing-library/react";
import i18n from "@/i18n";
import {
	TEST_TRANSFER_AMOUNT,
	TEST_TRANSFER_DESCRIPTION,
	TEST_TRANSFER_FIXTURE,
	TEST_UPDATED_BALANCE,
} from "@/test/fixtures/transfers";
import {
	createUser,
	fillRecipientStep,
	fillTransferDetailsStep,
	submitTransfer,
} from "@/test/transfer-test-helpers";
import { renderTransferFlow } from "@/test/render-utils";
import { useAuthStore } from "@/stores/auth-store";

const tDashboard = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "dashboard", ...options });
const tTransfers = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "transfers", ...options });

describe("transfer flow integration", () => {
	it("atualiza saldo e últimas transferências no dashboard após uma transferência bem-sucedida", async () => {
		const user = createUser();

		renderTransferFlow();

		await fillRecipientStep(user);
		await fillTransferDetailsStep(user);
		await submitTransfer();

		expect(useAuthStore.getState().balance).toBe(TEST_UPDATED_BALANCE);

		const latestTransfersSection = screen
			.getByRole("heading", { name: tDashboard("latestTransfers") })
			.closest("section");

		expect(latestTransfersSection).not.toBeNull();

		const latestTransfers = within(latestTransfersSection as HTMLElement);
		const createdTransferRow = latestTransfers
			.getByText(TEST_TRANSFER_FIXTURE.recipientName)
			.closest("tr");

		expect(screen.getByText(/R\$\s*7\.500,00/)).toBeInTheDocument();
		expect(createdTransferRow).not.toBeNull();

		const createdTransfer = within(createdTransferRow as HTMLElement);

		expect(
			createdTransfer.getByText(TEST_TRANSFER_FIXTURE.recipientName),
		).toBeInTheDocument();
		expect(createdTransfer.getByText(TEST_TRANSFER_DESCRIPTION)).toBeInTheDocument();
		expect(
			createdTransfer.getByText(tTransfers("table.completed")),
		).toBeInTheDocument();
		expect(
			createdTransfer.getByText(
				new RegExp(
					`-\\s*R\\$\\s*${TEST_TRANSFER_AMOUNT.toLocaleString("pt-BR")},00`.replace(
						".",
						"\\.",
					),
				),
			),
		).toBeInTheDocument();
	});
});
