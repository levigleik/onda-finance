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
import { FormFieldDate } from "@/components/form/form-field-date";
import { FormFieldNumber } from "@/components/form/form-field-number";
import { FormFieldText } from "@/components/form/form-field-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
	TransfersFormValues,
	TransferTiming,
} from "@/pages/transfers/validations/validations-transfers";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "short",
	year: "numeric",
});

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
	const amountPreview =
		typeof values.amount === "number" && Number.isFinite(values.amount)
			? currencyFormatter.format(values.amount)
			: "R$ 0,00";

	const transferDatePreview =
		values.transferTiming === "now"
			? "Hoje"
			: values.transferDate
				? dateFormatter.format(new Date(`${values.transferDate}T00:00:00`))
				: "Selecione uma data";

	return (
		<section className="rounded-md border bg-card p-6 shadow-sm md:p-8">
			<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
						Etapa 2
					</p>
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-foreground">
							Defina valor, data e revise os participantes.
						</h2>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
							Antes de confirmar, revisamos remetente, destinatário e os dados
							da transferência em um só lugar.
						</p>
					</div>
				</div>

				<div className="rounded-3xl border bg-background/30/30 px-5 py-4 text-right">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						Valor previsto
					</p>
					<p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
						{amountPreview}
					</p>
					<p className="mt-2 text-xs text-muted-foreground">
						Saldo disponível: {currencyFormatter.format(availableBalance)}
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
										Quando enviar
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
													<p className="font-semibold">Enviar agora</p>
													<p className="text-xs text-muted-foreground">
														Processa usando a data de hoje.
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
													<p className="font-semibold">Agendar</p>
													<p className="text-xs text-muted-foreground">
														Escolha uma data futura para envio.
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
						label="Valor da transferência"
						placeholder="R$ 0,00"
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
							Saldo disponível para transferir:{" "}
							<span className="font-semibold text-foreground">
								{currencyFormatter.format(availableBalance)}
							</span>
						</p>
					</div>

					{values.transferTiming === "scheduled" ? (
						<FormFieldDate
							control={control}
							name="transferDate"
							label="Data do agendamento"
							calendarProps={{
								disabled: (date) => startOfDay(date) <= startOfDay(new Date()),
							}}
						/>
					) : null}

					<div className="md:col-span-2">
						<FormFieldText
							control={control}
							name="description"
							label="Descrição"
							placeholder="Ex: repasse do projeto de março"
							maxLength={120}
						/>
					</div>
				</div>

				<aside className="space-y-4 rounded-3xl border bg-background/30/30 p-5">
					<div className="rounded-2xl border bg-background/30 p-4">
						<div className="mb-3 flex items-center gap-2">
							<UserRound className="h-4 w-4 text-primary" />
							<p className="text-sm font-semibold text-foreground">Remetente</p>
						</div>
						<p className="text-sm font-semibold text-foreground">
							{senderName || "Usuário autenticado"}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{senderEmail || "email@onda.com"}
						</p>
					</div>

					<div className="rounded-2xl border bg-background/30 p-4">
						<p className="text-sm font-semibold text-foreground">
							Destinatário
						</p>
						<p className="mt-2 text-sm font-semibold text-foreground">
							{values.recipientName || "Aguardando preenchimento"}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{values.recipientEmail || "Sem e-mail informado"}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Documento: {values.recipientDocument || "Sem documento informado"}
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
						<div className="rounded-2xl border bg-background/30 p-4">
							<div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								<CalendarDays className="h-3.5 w-3.5" />
								Data
							</div>
							<p className="text-sm font-semibold text-foreground">
								{transferDatePreview}
							</p>
						</div>

						<div className="rounded-2xl border bg-background/30 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Saldo disponível
							</p>
							<p className="mt-2 text-sm font-semibold text-foreground">
								{currencyFormatter.format(availableBalance)}
							</p>
						</div>

						<div className="rounded-2xl border bg-background/30 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Descrição
							</p>
							<p className="mt-2 text-sm font-semibold text-foreground">
								{values.description || "Sem descrição"}
							</p>
						</div>
					</div>
				</aside>
			</div>

			<div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
				<Button type="button" variant="ghost" className="h-12" onClick={onBack}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Voltar para destinatário
				</Button>

				<Button
					type="submit"
					size="lg"
					className="h-12 px-7"
					disabled={isSubmitDisabled || isSubmitting}
				>
					{isSubmitting ? "Salvando..." : "Confirmar transferência"}
					<CheckCircle2 className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</section>
	);
};
