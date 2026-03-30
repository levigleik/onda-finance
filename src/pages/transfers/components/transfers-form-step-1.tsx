import { ArrowRight, Mail, UserRound } from "lucide-react";
import type { Control } from "react-hook-form";
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
}: TransfersRecipientStepProps) => (
	<section className="rounded-md border bg-card p-6 shadow-sm md:p-8">
		<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
					Etapa 1
				</p>
				<div>
					<h2 className="text-2xl font-semibold tracking-tight text-foreground">
						Quem vai receber a transferência?
					</h2>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
						O remetente é definido automaticamente pelo usuário autenticado.
						Aqui você só informa os dados do destinatário.
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
						label="Nome do destinatário"
						placeholder="Ex: Marina Costa"
						autoComplete="name"
					/>
				</div>

				<FormFieldText
					control={control}
					name="recipientEmail"
					label="E-mail do destinatário"
					type="email"
					placeholder="destinatario@onda.com"
					autoComplete="email"
				/>

				<FormFieldText
					control={control}
					name="recipientDocument"
					label="CPF"
					placeholder="000.000.000-00"
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
							Remetente autenticado
						</p>
						<p className="text-xs text-muted-foreground">
							Salvo automaticamente na transferência
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="rounded-2xl border bg-background/30/20 p-4">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							Nome
						</p>
						<p className="mt-2 text-sm font-semibold text-foreground">
							{senderName || "Usuário autenticado"}
						</p>
					</div>

					<div className="rounded-2xl border bg-background/30/20 p-4">
						<div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							<Mail className="h-3.5 w-3.5" />
							E-mail
						</div>
						<p className="text-sm font-semibold text-foreground">
							{senderEmail || "email@onda.com"}
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
				Continuar para valor e data
				<ArrowRight className="ml-2 h-4 w-4" />
			</Button>
		</div>
	</section>
);
