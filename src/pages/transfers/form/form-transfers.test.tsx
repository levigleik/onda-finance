import { act, fireEvent, screen } from "@testing-library/react";
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
import { useTransfersStore } from "@/stores/transfers-store";

describe("FormTransfers", () => {
	it("não avança da etapa 1 com destinatário inválido e exibe os erros esperados", async () => {
		const user = createUser();

		renderFormTransfers();

		await user.type(screen.getByLabelText(/nome do destinatário/i), "Ma");
		await user.type(screen.getByLabelText(/e-mail do destinatário/i), "email");
		await user.type(screen.getByLabelText(/^cpf$/i), "11111111111");
		await user.click(
			screen.getByRole("button", { name: /continuar para valor e data/i }),
		);

		expect(
			screen.getByText("Informe o nome completo do destinatário"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Informe um e-mail válido para o destinatário"),
		).toBeInTheDocument();
		expect(screen.getByText("Informe um CPF válido")).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", {
				name: /defina valor, data e revise os participantes/i,
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
				name: /defina valor, data e revise os participantes/i,
			}),
		).toBeInTheDocument();

		await fillTransferDetailsStep(user);
		await submitTransfer();

		const createdTransfer = useTransfersStore.getState().transfers[0];

		expect(createdTransfer.status).toBe("concluida");
		expect(createdTransfer.transferDate).toBe("2026-03-30");
		expect(createdTransfer.sender).toEqual(TEST_AUTH_USER);
		expect(createdTransfer.recipient).toEqual({
			name: "Marina Costa",
			email: "marina@onda.com",
			document: "52998224725",
		});
		expect(createdTransfer.amount).toBe(TEST_TRANSFER_AMOUNT);
		expect(createdTransfer.description).toBe(TEST_TRANSFER_DESCRIPTION);
		expect(useAuthStore.getState().balance).toBe(TEST_UPDATED_BALANCE);
		expect(onSuccess).toHaveBeenCalledTimes(1);
		expect(
			screen.getByRole("heading", {
				name: /quem vai receber a transferência/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByLabelText(/nome do destinatário/i),
		).toHaveValue("");
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
			name: /confirmar transferência/i,
		});
		const form = submitButton.closest("form");

		expect(form).not.toBeNull();

		await act(async () => {
			useAuthStore.getState().setBalance(1_000);
			await Promise.resolve();
			fireEvent.submit(form as HTMLFormElement);
		});

		expect(
			await screen.findByText(/Saldo insuficiente\.\s+Disponível:\s+R\$\s*1\.000,00\./),
		).toBeInTheDocument();
		expect(useTransfersStore.getState().transfers).toHaveLength(0);
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

		expect(createdTransfer.status).toBe("agendada");
		expect(createdTransfer.transferDate).toBe(TEST_SCHEDULED_DATE);
		expect(createdTransfer.amount).toBe(TEST_TRANSFER_AMOUNT);
		expect(useAuthStore.getState().balance).toBe(TEST_UPDATED_BALANCE);
		expect(
			screen.getByRole("heading", {
				name: /quem vai receber a transferência/i,
			}),
		).toBeInTheDocument();
	});
});
