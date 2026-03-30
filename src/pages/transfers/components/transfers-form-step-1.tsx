import { ArrowRight, Mail, UserRound } from "lucide-react";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormFieldText } from "@/components/form/form-field-text";
import { Button } from "@/components/ui/button";
import type { TransfersFormValues } from "@/pages/transfers/validations/validations-transfers";

const maskCpf = (value: string) => {
	const digits = value.replace(/\D/g, "").slice(0, 11);

	return digits
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

interface TransfersRecipientStepProps {
	control: Control<TransfersFormValues>;
	senderName?: string;
	senderEmail?: string;
	onContinue: () => void;
}

export const TransfersFormStep1 = ({
	control,
	senderName,
	senderEmail,
	onContinue,
}: TransfersRecipientStepProps) => {
	const { t } = useTranslation("transfers");

	return (
		<section className="rounded-md border bg-card p-6 shadow-sm md:p-8">
			<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
						{t("step1.badge")}
					</p>
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-foreground">
							{t("step1.title")}
						</h2>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
							{t("step1.description")}
						</p>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
				<div className="grid gap-5 md:grid-cols-2">
					<div className="md:col-span-2">
						<FormFieldText
							control={control}
							name="recipientName"
							label={t("step1.recipientName")}
							placeholder={t("step1.recipientNamePlaceholder")}
							autoComplete="name"
						/>
					</div>

					<FormFieldText
						control={control}
						name="recipientEmail"
						label={t("step1.recipientEmail")}
						type="email"
						placeholder={t("step1.recipientEmailPlaceholder")}
						autoComplete="email"
					/>

					<FormFieldText
						control={control}
						name="recipientDocument"
						label={t("step1.recipientDocument")}
						placeholder={t("step1.recipientDocumentPlaceholder")}
						inputMode="numeric"
						pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"
						autoComplete="off"
						maxLength={14}
						transformValue={maskCpf}
					/>
				</div>

				<aside className="rounded-3xl border bg-background/30/30 p-5">
					<div className="mb-5 flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
							<UserRound className="h-5 w-5" />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">
								{t("step1.senderTitle")}
							</p>
							<p className="text-xs text-muted-foreground">
								{t("step1.senderDescription")}
							</p>
						</div>
					</div>

					<div className="space-y-4">
						<div className="rounded-2xl border bg-background/30/20 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								{t("step1.name")}
							</p>
							<p className="mt-2 text-sm font-semibold text-foreground">
								{senderName || t("step1.senderFallbackName")}
							</p>
						</div>

						<div className="rounded-2xl border bg-background/30/20 p-4">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								<Mail className="h-3.5 w-3.5" />
								{t("step1.email")}
							</div>
							<p className="text-sm font-semibold text-foreground">
								{senderEmail || t("step1.senderFallbackEmail")}
							</p>
						</div>
					</div>
				</aside>
			</div>

			<div className="mt-8 flex justify-end border-t pt-6">
				<Button
					type="button"
					size="lg"
					className="h-12 px-7"
					onClick={onContinue}
				>
					{t("step1.continue")}
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</section>
	);
};
