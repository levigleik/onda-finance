import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormFieldNumber } from "@/components/form/form-field-number";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";
import { useBalanceSettingsStore } from "@/stores/balance-settings-store";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const balanceSettingsSchema = z.object({
	balance: z
		.custom<number>(
			(value) => typeof value === "number" && Number.isFinite(value),
			"Informe um saldo válido",
		)
		.refine((value) => value >= 0, "O saldo não pode ser negativo"),
});

type BalanceSettingsFormValues = z.infer<typeof balanceSettingsSchema>;

export const BalanceSettingsDialog = () => {
	const balance = useAuthStore((state) => state.balance);
	const setBalance = useAuthStore((state) => state.setBalance);
	const isOpen = useBalanceSettingsStore(
		(state) => state.isBalanceSettingsOpen,
	);
	const setBalanceSettingsOpen = useBalanceSettingsStore(
		(state) => state.setBalanceSettingsOpen,
	);
	const closeBalanceSettings = useBalanceSettingsStore(
		(state) => state.closeBalanceSettings,
	);

	const form = useForm<BalanceSettingsFormValues>({
		resolver: zodResolver(balanceSettingsSchema),
		defaultValues: {
			balance,
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		form.reset({ balance });
	}, [balance, form, isOpen]);

	const handleSubmit = form.handleSubmit((data) => {
		setBalance(data.balance);
		toast.success("Saldo atualizado com sucesso.", {
			description: `Novo saldo disponível: ${currencyFormatter.format(data.balance)}.`,
		});
		closeBalanceSettings();
	});

	return (
		<Dialog open={isOpen} onOpenChange={setBalanceSettingsOpen}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Configurações de saldo
					</DialogTitle>
					<DialogDescription>
						Ajuste manualmente o saldo exibido na conta e usado para validar
						novas transferências.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5" noValidate>
					<div className="rounded-2xl border bg-muted/20 p-4">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							Saldo atual
						</p>
						<p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
							{currencyFormatter.format(balance)}
						</p>
					</div>

					<FormFieldNumber
						control={form.control}
						name="balance"
						label="Novo saldo"
						placeholder="R$ 0,00"
						minValue={0}
						step={0.01}
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

					<DialogFooter className="pt-1">
						<Button
							type="button"
							variant="outline"
							onClick={closeBalanceSettings}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							Salvar saldo
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
