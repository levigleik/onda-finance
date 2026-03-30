import { z } from "zod";

export const transferTimingSchema = z.enum(["now", "scheduled"]);
export type TransferTiming = z.infer<typeof transferTimingSchema>;

const CPF_PATTERN = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const normalizeDocument = (value: string) => value.replace(/\D/g, "");

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

const isValidTransferDate = (value: string) => {
	if (!value) {
		return false;
	}

	const selectedDate = new Date(`${value}T00:00:00`);

	if (Number.isNaN(selectedDate.getTime())) {
		return false;
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return selectedDate >= today;
};

const amountSchema = z
	.custom<number>(
		(value) => typeof value === "number" && Number.isFinite(value),
		"Informe o valor da transferência",
	)
	.refine((value) => value > 0, "Informe um valor maior que zero");

export const transferRecipientSchema = z.object({
	recipientName: z
		.string()
		.trim()
		.min(3, "Informe o nome completo do destinatário"),
	recipientEmail: z.email("Informe um e-mail válido para o destinatário"),
	recipientDocument: z
		.string()
		.trim()
		.regex(CPF_PATTERN, "Informe o CPF no formato 000.000.000-00")
		.refine(isValidCpf, "Informe um CPF válido")
		.transform(normalizeDocument),
});

export const transferDetailsSchema = z.object({
	amount: amountSchema,
	transferTiming: transferTimingSchema,
	transferDate: z.string().optional(),
	description: z
		.string()
		.trim()
		.max(120, "A descrição pode ter no máximo 120 caracteres")
		.optional(),
}).superRefine((data, ctx) => {
	if (data.transferTiming === "now") {
		return;
	}

	if (!data.transferDate) {
		ctx.addIssue({
			code: "custom",
			path: ["transferDate"],
			message: "Selecione a data do agendamento",
		});
		return;
	}

	if (!isValidTransferDate(data.transferDate)) {
		ctx.addIssue({
			code: "custom",
			path: ["transferDate"],
			message: "A data da transferência deve ser hoje ou futura",
		});
		return;
	}

	const selectedDate = new Date(`${data.transferDate}T00:00:00`);
	const today = new Date();

	selectedDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	if (selectedDate.getTime() <= today.getTime()) {
		ctx.addIssue({
			code: "custom",
			path: ["transferDate"],
			message: "O agendamento deve ser para uma data futura",
		});
	}
});

export const transferFormSchema =
	transferRecipientSchema.merge(transferDetailsSchema);

export type TransfersFormValues = z.infer<typeof transferFormSchema>;

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
