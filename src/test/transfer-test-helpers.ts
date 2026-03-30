import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from "@/i18n";
import {
	TEST_SCHEDULED_DATE,
	TEST_TRANSFER_AMOUNT,
	TEST_TRANSFER_DESCRIPTION_PADDED,
	TEST_TRANSFER_FIXTURE,
} from "@/test/fixtures/transfers";

const tTransfers = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "transfers", ...options });

const getAmountInput = () =>
	screen.getByRole("textbox", {
		name: tTransfers("step2.transferAmount"),
	}) as HTMLInputElement;

const getScheduledDateButton = async () => {
	await waitFor(() => {
		expect(document.getElementById("transferDate")).not.toBeNull();
	});

	return document.getElementById("transferDate") as HTMLButtonElement;
};

const getCalendarDayValue = (date: string) => {
	const [year, month, day] = date.split("-");

	return `${day}/${month}/${year}`;
};

export const createUser = () => userEvent.setup();

export const fillRecipientStep = async (
	user: ReturnType<typeof createUser>,
	overrides?: Partial<typeof TEST_TRANSFER_FIXTURE>,
) => {
	await user.type(
		screen.getByLabelText(tTransfers("step1.recipientName")),
		overrides?.recipientName ?? TEST_TRANSFER_FIXTURE.recipientName,
	);
	await user.type(
		screen.getByLabelText(tTransfers("step1.recipientEmail")),
		overrides?.recipientEmail ?? TEST_TRANSFER_FIXTURE.recipientEmail,
	);
	await user.type(
		screen.getByLabelText(tTransfers("step1.recipientDocument")),
		(overrides?.recipientDocument ?? TEST_TRANSFER_FIXTURE.recipientDocument).replace(
			/\D/g,
			"",
		),
	);
	await user.click(
		screen.getByRole("button", {
			name: tTransfers("step1.continue"),
		}),
	);
};

export const fillTransferDetailsStep = async (
	user: ReturnType<typeof createUser>,
	{
		amount = TEST_TRANSFER_AMOUNT,
		description = TEST_TRANSFER_DESCRIPTION_PADDED,
		transferTiming = "now",
		transferDate = TEST_SCHEDULED_DATE,
	}: {
		amount?: number;
		description?: string;
		transferTiming?: "now" | "scheduled";
		transferDate?: string;
	} = {},
) => {
	if (transferTiming === "scheduled") {
		await act(async () => {
			fireEvent.click(
				screen.getByRole("button", {
					name: new RegExp(tTransfers("step2.schedule"), "i"),
				}),
			);
		});
		await user.click(await getScheduledDateButton());

		const dayButton = document.querySelector<HTMLButtonElement>(
			`[data-day="${getCalendarDayValue(transferDate)}"]`,
		);

		if (!dayButton) {
			throw new Error(`Dia ${transferDate} não encontrado no calendário.`);
		}

		await user.click(dayButton);
	}

	const amountInput = getAmountInput();
	await user.clear(amountInput);
	await user.type(amountInput, `${amount}`);

	if (description !== undefined) {
		await user.type(
			screen.getByLabelText(tTransfers("step2.descriptionLabel")),
			description,
		);
	}
};

export const submitTransfer = async () => {
	const submitButton = screen.getByRole("button", {
		name: tTransfers("step2.confirm"),
	});
	const form = submitButton.closest("form");

	if (!form) {
		throw new Error("Não foi possível localizar o formulário de transferência.");
	}

	await act(async () => {
		vi.useFakeTimers();
		fireEvent.submit(form);
		await vi.advanceTimersByTimeAsync(600);
		vi.useRealTimers();
	});
};
