import type { TFunction } from "i18next";
import { z } from "zod";
import type { AppLanguage } from "@/i18n/config";
import { formatCurrency } from "@/i18n/format";

export const transferTimingSchema = z.enum(["now", "scheduled"]);
export type TransferTiming = z.infer<typeof transferTimingSchema>;

const CPF_PATTERN = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export interface TransfersFormValues {
	recipientName: string;
	recipientEmail: string;
	recipientDocument: string;
	amount: number;
	transferTiming: TransferTiming;
	transferDate?: string;
	description?: string;
}

const normalizeDocument = (value: string) => value.replace(/\D/g, "");
const normalizeCurrencyValue = (value: number) =>
	Math.round((value + Number.EPSILON) * 100) / 100;

const isValidCpf = (value: string) => {
	const digits = normalizeDocument(value);

	if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
		return false;
	}

	let sum = 0;

	for (let index = 0; index < 9; index += 1) {
		sum += Number(digits[index]) * (10 - index);
	}

	let remainder = (sum * 10) % 11;

	if (remainder === 10) {
		remainder = 0;
	}

	if (remainder !== Number(digits[9])) {
		return false;
	}

	sum = 0;

	for (let index = 0; index < 10; index += 1) {
		sum += Number(digits[index]) * (11 - index);
	}

	remainder = (sum * 10) % 11;

	if (remainder === 10) {
		remainder = 0;
	}

	return remainder === Number(digits[10]);
};

const isValidFutureTransferDate = (value: string) => {
	if (!value) {
		return false;
	}

	const selectedDate = new Date(`${value}T00:00:00`);

	if (Number.isNaN(selectedDate.getTime())) {
		return false;
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return selectedDate > today;
};

const createAmountSchema = (t: TFunction) =>
	z
		.custom<number>(
			(value) => typeof value === "number" && Number.isFinite(value),
			t("transfers.validation.amountRequired"),
		)
		.refine((value) => value > 0, t("transfers.validation.amountPositive"));

export const getInsufficientBalanceMessage = (
	availableBalance: number,
	t: TFunction,
	language: AppLanguage,
) =>
	t("transfers.validation.insufficientBalance", {
		balance: formatCurrency(
			language,
			normalizeCurrencyValue(Math.max(0, availableBalance)),
		),
	});

export const createTransferRecipientSchema = (t: TFunction) =>
	z.object({
		recipientName: z
			.string()
			.trim()
			.min(3, t("transfers.validation.recipientName")),
		recipientEmail: z.email(t("transfers.validation.recipientEmail")),
		recipientDocument: z
			.string()
			.trim()
			.regex(CPF_PATTERN, t("transfers.validation.recipientDocumentFormat"))
			.refine(isValidCpf, t("transfers.validation.recipientDocument"))
			.transform(normalizeDocument),
	});

const createTransferDetailsBaseSchema = (t: TFunction) =>
	z.object({
		amount: createAmountSchema(t),
		transferTiming: transferTimingSchema,
		transferDate: z.string().optional(),
		description: z
			.string()
			.trim()
			.max(120, t("transfers.validation.descriptionMax"))
			.optional(),
	});

export const createTransferDetailsSchema = (
	availableBalance: number,
	t: TFunction,
	language: AppLanguage,
) =>
	createTransferDetailsBaseSchema(t).superRefine((data, ctx) => {
		if (data.amount > normalizeCurrencyValue(Math.max(0, availableBalance))) {
			ctx.addIssue({
				code: "custom",
				path: ["amount"],
				message: getInsufficientBalanceMessage(availableBalance, t, language),
			});
		}

		if (data.transferTiming === "now") {
			return;
		}

		if (!data.transferDate) {
			ctx.addIssue({
				code: "custom",
				path: ["transferDate"],
				message: t("transfers.validation.scheduleDateRequired"),
			});
			return;
		}

		if (!isValidFutureTransferDate(data.transferDate)) {
			ctx.addIssue({
				code: "custom",
				path: ["transferDate"],
				message: t("transfers.validation.scheduleDateFuture"),
			});
		}
	});

export const createTransferFormSchema = (
	availableBalance: number,
	t: TFunction,
	language: AppLanguage,
) =>
	createTransferRecipientSchema(t).merge(
		createTransferDetailsSchema(availableBalance, t, language),
	);

export const transferRecipientFields = [
	"recipientName",
	"recipientEmail",
	"recipientDocument",
] as const satisfies ReadonlyArray<keyof TransfersFormValues>;

export const transferDetailsFields = [
	"amount",
	"transferTiming",
	"transferDate",
	"description",
] as const satisfies ReadonlyArray<keyof TransfersFormValues>;
