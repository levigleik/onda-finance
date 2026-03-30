import { startOfDay } from "date-fns";
import {
	ArrowLeft,
	CalendarDays,
	CalendarPlus2,
	CheckCircle2,
	Send,
	UserRound,
} from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormFieldDate } from "@/components/form/form-field-date";
import { FormFieldNumber } from "@/components/form/form-field-number";
import { FormFieldText } from "@/components/form/form-field-text";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/i18n/format";
import { useAppLanguage } from "@/i18n/use-app-language";
import { cn } from "@/lib/utils";
import type {
	TransfersFormValues,
	TransferTiming,
} from "@/pages/transfers/validations/validations-transfers";

interface TransfersDetailsStepProps {
	control: Control<TransfersFormValues>;
	senderName?: string;
	senderEmail?: string;
	values: TransfersFormValues;
	availableBalance: number;
	onTransferTimingChange: (timing: TransferTiming) => void;
	onBack: () => void;
	isSubmitting: boolean;
	isSubmitDisabled: boolean;
}

export const TransfersFormStep2 = ({
	control,
	senderName,
	senderEmail,
	values,
	availableBalance,
	onTransferTimingChange,
	onBack,
	isSubmitting,
	isSubmitDisabled,
}: TransfersDetailsStepProps) => {
	const { t } = useTranslation();
	const { i18nLanguage } = useAppLanguage();
	const amountPreview =
		typeof values.amount === "number" && Number.isFinite(values.amount)
			? formatCurrency(i18nLanguage, values.amount)
			: formatCurrency(i18nLanguage, 0);

	const transferDatePreview =
		values.transferTiming === "now"
			? t("transfers.step2.today")
			: values.transferDate
				? formatDate(
						i18nLanguage,
						new Date(`${values.transferDate}T00:00:00`),
						{
							day: "2-digit",
							month: "short",
							year: "numeric",
						},
					)
				: t("transfers.step2.selectDate");

	return (
		<section className="rounded-md border bg-card p-6 shadow-sm md:p-8">
			<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
						{t("transfers.step2.badge")}
					</p>
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-foreground">
							{t("transfers.step2.title")}
						</h2>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
							{t("transfers.step2.description")}
						</p>
					</div>
				</div>

				<div className="rounded-3xl border bg-background/30/30 px-5 py-4 text-right">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						{t("transfers.step2.valuePreview")}
					</p>
					<p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
						{amountPreview}
					</p>
					<p className="mt-2 text-xs text-muted-foreground">
						{t("transfers.step2.availableBalance", {
							balance: formatCurrency(i18nLanguage, availableBalance),
						})}
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
				<div className="grid gap-5 md:grid-cols-2">
					<div className="md:col-span-2">
						<Controller
							control={control}
							name="transferTiming"
							render={({ field }) => (
								<div className="space-y-2">
									<p className="text-sm font-medium text-foreground">
										{t("transfers.step2.whenToSend")}
									</p>
									<div className="grid gap-3 sm:grid-cols-2">
										<Button
											type="button"
											variant="outline"
											className={cn(
												"h-auto justify-start rounded-2xl border bg-popover px-4 py-3 text-left",
												field.value === "now" &&
													"border-primary bg-primary/5 text-foreground",
											)}
											onClick={() => {
												field.onChange("now");
												onTransferTimingChange("now");
											}}
										>
											<div className="flex items-start gap-3">
												<div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
													<Send className="h-4 w-4" />
												</div>
												<div>
													<p className="font-semibold">
														{t("transfers.step2.sendNow")}
													</p>
													<p className="text-xs text-muted-foreground">
														{t("transfers.step2.sendNowDescription")}
													</p>
												</div>
											</div>
										</Button>

										<Button
											type="button"
											variant="outline"
											className={cn(
												"h-auto justify-start rounded-2xl border bg-popover px-4 py-3 text-left",
												field.value === "scheduled" &&
													"border-primary bg-primary/5 text-foreground",
											)}
											onClick={() => {
												field.onChange("scheduled");
												onTransferTimingChange("scheduled");
											}}
										>
											<div className="flex items-start gap-3">
												<div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
													<CalendarPlus2 className="h-4 w-4" />
												</div>
												<div>
													<p className="font-semibold">
														{t("transfers.step2.schedule")}
													</p>
													<p className="text-xs text-muted-foreground">
														{t("transfers.step2.scheduleDescription")}
													</p>
												</div>
											</div>
										</Button>
									</div>
								</div>
							)}
						/>
					</div>

					<FormFieldNumber
						control={control}
						name="amount"
						label={t("transfers.step2.transferAmount")}
						placeholder={formatCurrency(i18nLanguage, 0)}
						minValue={0}
						step={0.5}
						formatOptions={{
							style: "currency",
							currency: "BRL",
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}}
						inputProps={{
							className: "text-right font-semibold tabular-nums",
						}}
					/>

					<div className="md:col-span-2 -mt-2">
						<p className="text-xs text-muted-foreground">
							{t("transfers.step2.availableToTransfer", {
								balance: formatCurrency(i18nLanguage, availableBalance),
							})}
						</p>
					</div>

					{values.transferTiming === "scheduled" ? (
						<FormFieldDate
							control={control}
							name="transferDate"
							label={t("transfers.step2.scheduledDate")}
							calendarProps={{
								disabled: (date) => startOfDay(date) <= startOfDay(new Date()),
							}}
						/>
					) : null}

					<div className="md:col-span-2">
						<FormFieldText
							control={control}
							name="description"
							label={t("transfers.step2.descriptionLabel")}
							placeholder={t("transfers.step2.descriptionPlaceholder")}
							maxLength={120}
						/>
					</div>
				</div>

				<aside className="space-y-4 rounded-3xl border bg-background/30/30 p-5">
					<div className="rounded-2xl border bg-background/30 p-4">
						<div className="mb-3 flex items-center gap-2">
							<UserRound className="h-4 w-4 text-primary" />
							<p className="text-sm font-semibold text-foreground">
								{t("transfers.step2.sender")}
							</p>
						</div>
						<p className="text-sm font-semibold text-foreground">
							{senderName || t("transfers.step1.senderFallbackName")}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{senderEmail || t("transfers.step1.senderFallbackEmail")}
						</p>
					</div>

					<div className="rounded-2xl border bg-background/30 p-4">
						<p className="text-sm font-semibold text-foreground">
							{t("transfers.step2.recipient")}
						</p>
						<p className="mt-2 text-sm font-semibold text-foreground">
							{values.recipientName || t("transfers.step2.waitingRecipient")}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{values.recipientEmail || t("transfers.step2.recipientNoEmail")}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{values.recipientDocument
								? t("transfers.step2.recipientDocument", {
										document: values.recipientDocument,
									})
								: t("transfers.step2.recipientNoDocument")}
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
						<div className="rounded-2xl border bg-background/30 p-4">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								<CalendarDays className="h-3.5 w-3.5" />
								{t("transfers.step2.date")}
							</div>
							<p className="text-sm font-semibold text-foreground">
								{transferDatePreview}
							</p>
						</div>

						<div className="rounded-2xl border bg-background/30 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								{t("transfers.step2.balance")}
							</p>
							<p className="mt-2 text-sm font-semibold text-foreground">
								{formatCurrency(i18nLanguage, availableBalance)}
							</p>
						</div>

						<div className="rounded-2xl border bg-background/30 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								{t("transfers.step2.descriptionLabel")}
							</p>
							<p className="mt-2 text-sm font-semibold text-foreground">
								{values.description || t("transfers.step2.noDescription")}
							</p>
						</div>
					</div>
				</aside>
			</div>

			<div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
				<Button type="button" variant="ghost" className="h-12" onClick={onBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("transfers.step2.back")}
				</Button>

				<Button
					type="submit"
					size="lg"
					className="h-12 px-7"
					disabled={isSubmitDisabled || isSubmitting}
				>
					{isSubmitting ? t("transfers.step2.saving") : t("transfers.step2.confirm")}
					<CheckCircle2 className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</section>
	);
};
