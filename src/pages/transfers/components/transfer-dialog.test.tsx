import { screen, waitFor } from "@testing-library/react";
import { TransferDialog } from "@/pages/transfers/components/transfer-dialog";
import {
	createUser,
	fillRecipientStep,
	fillTransferDetailsStep,
} from "@/test/transfer-test-helpers";
import {
	renderWithProviders,
	seedAuthenticatedSession,
} from "@/test/render-utils";
import { useTransferModalStore } from "@/stores/transfer-modal-store";

const renderOpenTransferDialog = () => {
	seedAuthenticatedSession();
	useTransferModalStore.getState().openTransferModal();

	return renderWithProviders(<TransferDialog />);
};

const getDialogOverlay = () => {
	const overlay = document.querySelector(
		"[data-slot='dialog-overlay']",
	) as HTMLElement | null;

	if (!overlay) {
		throw new Error("Não foi possível localizar o overlay do modal.");
	}

	return overlay;
};

describe("TransferDialog", () => {
	it("aplica as classes de animacao padronizadas no overlay e no content do modal", async () => {
		renderOpenTransferDialog();

		expect(await screen.findByRole("dialog")).toBeInTheDocument();

		const overlay = getDialogOverlay();
		const dialogContent = document.querySelector(
			"[data-slot='dialog-content']",
		) as HTMLElement | null;

		expect(overlay).toHaveClass("duration-200");
		expect(dialogContent).not.toBeNull();
		expect(dialogContent).toHaveClass("duration-200");
		expect(dialogContent).toHaveClass("data-open:zoom-in-95");
	});

	it("fecha ao clicar fora quando o formulário ainda não está pronto para envio", async () => {
		const user = createUser();

		renderOpenTransferDialog();

		expect(await screen.findByRole("dialog")).toBeInTheDocument();

		await user.click(getDialogOverlay());

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
		expect(useTransferModalStore.getState().isTransferModalOpen).toBe(false);
	});

	it("não fecha ao clicar fora quando todos os campos válidos já foram preenchidos", async () => {
		const user = createUser();

		renderOpenTransferDialog();

		await fillRecipientStep(user);
		await fillTransferDetailsStep(user);

		expect(useTransferModalStore.getState().isTransferModalOpen).toBe(true);

		await user.click(getDialogOverlay());

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(useTransferModalStore.getState().isTransferModalOpen).toBe(true);
	});
});
