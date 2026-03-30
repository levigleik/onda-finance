import { act, fireEvent, screen } from "@testing-library/react";
import i18n from "@/i18n";
import {
	TEST_AUTH_USER,
	TEST_SCHEDULED_DATE,
	TEST_TRANSFER_AMOUNT,
	TEST_TRANSFER_DESCRIPTION,
	TEST_UPDATED_BALANCE,
} from "@/test/fixtures/transfers";
import {
	createUser,
	fillRecipientStep,
	fillTransferDetailsStep,
	submitTransfer,
} from "@/test/transfer-test-helpers";
import { renderFormTransfers } from "@/test/render-utils";
import { useAuthStore } from "@/stores/auth-store";
import {
	DEFAULT_TRANSFER_SEED,
	useTransfersStore,
} from "@/stores/transfers-store";

const tTransfers = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "transfers", ...options });

describe("FormTransfers", () => {
	it("não avança da etapa 1 com destinatário inválido e exibe os erros esperados", async () => {
		const user = createUser();

		renderFormTransfers();

		await user.type(
			screen.getByLabelText(tTransfers("step1.recipientName")),
			"Ma",
		);
		await user.type(
			screen.getByLabelText(tTransfers("step1.recipientEmail")),
			"email",
		);
		await user.type(
			screen.getByLabelText(tTransfers("step1.recipientDocument")),
			"11111111111",
		);
		await user.click(
			screen.getByRole("button", {
				name: tTransfers("step1.continue"),
			}),
		);

		expect(
			screen.getByText(tTransfers("validation.recipientName")),
		).toBeInTheDocument();
		expect(
			screen.getByText(tTransfers("validation.recipientEmail")),
		).toBeInTheDocument();
		expect(
			screen.getByText(tTransfers("validation.recipientDocument")),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", {
				name: tTransfers("step2.title"),
			}),
		).not.toBeInTheDocument();
	});

	it("realiza transferência imediata com sucesso, trimma descrição e reseta o formulário", async () => {
		const user = createUser();
		const onSuccess = vi.fn();

		renderFormTransfers({ onSuccess });

		await fillRecipientStep(user);
		expect(
			screen.getByRole("heading", {
				name: tTransfers("step2.title"),
			}),
		).toBeInTheDocument();

		await fillTransferDetailsStep(user);
		await submitTransfer();

		const createdTransfer = useTransfersStore.getState().transfers[0];

		expect(createdTransfer.status).toBe("completed");
		expect(createdTransfer.transferDate).toBe("2026-03-30");
		expect(createdTransfer.sender).toEqual(TEST_AUTH_USER);
		expect(createdTransfer.recipient).toEqual({
			name: "Marina Costa",
			email: "marina@onda.com",
			document: "52998224725",
		});
		expect(createdTransfer.amount).toBe(TEST_TRANSFER_AMOUNT);
		expect(createdTransfer.description).toBe(TEST_TRANSFER_DESCRIPTION);
		expect(useTransfersStore.getState().transfers).toHaveLength(
			DEFAULT_TRANSFER_SEED.length + 1,
		);
		expect(useAuthStore.getState().balance).toBe(TEST_UPDATED_BALANCE);
		expect(onSuccess).toHaveBeenCalledTimes(1);
		expect(
			screen.getByRole("heading", {
				name: tTransfers("step1.title"),
			}),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(tTransfers("step1.recipientName")),
		).toHaveValue("");
	});

	it("não exibe o erro de valor ao abrir a etapa 2 antes da interação", async () => {
		const user = createUser();

		renderFormTransfers();

		await fillRecipientStep(user);

		expect(
			screen.getByRole("heading", {
				name: tTransfers("step2.title"),
			}),
		).toBeInTheDocument();
		expect(
			screen.queryByText(tTransfers("validation.amountRequired")),
		).not.toBeInTheDocument();
	});

	it("bloqueia o submit se o saldo cair entre o preenchimento e a submissão", async () => {
		const user = createUser();
		const onSuccess = vi.fn();

		renderFormTransfers({
			balance: 3_000,
			onSuccess,
		});

		await fillRecipientStep(user);
		await fillTransferDetailsStep(user);

		const submitButton = screen.getByRole("button", {
			name: tTransfers("step2.confirm"),
		});
		const form = submitButton.closest("form");

		expect(form).not.toBeNull();

		await act(async () => {
			useAuthStore.getState().setBalance(1_000);
			await Promise.resolve();
			fireEvent.submit(form as HTMLFormElement);
		});

		const amountError = await screen.findByRole("alert");
		expect(amountError.textContent?.replace(/\s+/g, " ").trim()).toBe(
			i18n
				.t("validation.insufficientBalance", {
					ns: "transfers",
					balance: new Intl.NumberFormat("pt-BR", {
						style: "currency",
						currency: "BRL",
					}).format(1_000),
				})
				.replace(/\s+/g, " ")
				.trim(),
		);
		expect(useTransfersStore.getState().transfers).toHaveLength(
			DEFAULT_TRANSFER_SEED.length,
		);
		expect(useAuthStore.getState().balance).toBe(1_000);
		expect(onSuccess).not.toHaveBeenCalled();
	});

	it("realiza transferência agendada e debita o saldo imediatamente", async () => {
		const user = createUser();

		renderFormTransfers();

		await fillRecipientStep(user);
		await fillTransferDetailsStep(user, {
			transferTiming: "scheduled",
		});
		await submitTransfer();

		const createdTransfer = useTransfersStore.getState().transfers[0];

		expect(createdTransfer.status).toBe("scheduled");
		expect(createdTransfer.transferDate).toBe(TEST_SCHEDULED_DATE);
		expect(createdTransfer.amount).toBe(TEST_TRANSFER_AMOUNT);
		expect(useTransfersStore.getState().transfers).toHaveLength(
			DEFAULT_TRANSFER_SEED.length + 1,
		);
		expect(useAuthStore.getState().balance).toBe(TEST_UPDATED_BALANCE);
		expect(
			screen.getByRole("heading", {
				name: tTransfers("step1.title"),
			}),
		).toBeInTheDocument();
	});
});
