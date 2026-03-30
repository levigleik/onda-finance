import { screen, within } from "@testing-library/react";
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

describe("transfer flow integration", () => {
	it("atualiza saldo e últimas transferências no dashboard após uma transferência bem-sucedida", async () => {
		const user = createUser();

		renderTransferFlow();

		await fillRecipientStep(user);
		await fillTransferDetailsStep(user);
		await submitTransfer();

		expect(useAuthStore.getState().balance).toBe(TEST_UPDATED_BALANCE);

		const latestTransfersSection = screen
			.getByRole("heading", { name: /últimas transferências/i })
			.closest("section");

		expect(latestTransfersSection).not.toBeNull();

		const latestTransfers = within(latestTransfersSection as HTMLElement);

		expect(screen.getByText(/R\$\s*7\.500,00/)).toBeInTheDocument();
		expect(
			latestTransfers.getByText(TEST_TRANSFER_FIXTURE.recipientName),
		).toBeInTheDocument();
		expect(latestTransfers.getByText(TEST_TRANSFER_DESCRIPTION)).toBeInTheDocument();
		expect(latestTransfers.getByText("Concluída")).toBeInTheDocument();
		expect(
			latestTransfers.getByText(new RegExp(`-\\s*R\\$\\s*${TEST_TRANSFER_AMOUNT.toLocaleString("pt-BR")},00`.replace(".", "\\."))),
		).toBeInTheDocument();
	});
});
