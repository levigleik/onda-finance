import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { formatCurrency } from "@/i18n/format";
import { useAppLanguage } from "@/i18n/use-app-language";
import { useAuthStore } from "@/stores/auth-store";
import { useBalanceSettingsStore } from "@/stores/balance-settings-store";

type BalanceSettingsFormValues = {
	balance: number;
};

export const BalanceSettingsDialog = () => {
	const { t } = useTranslation(["balanceSettings", "common"]);
	const { i18nLanguage } = useAppLanguage();
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
	const balanceSettingsSchema = useMemo(
		() =>
			z.object({
				balance: z
					.custom<number>(
						(value) => typeof value === "number" && Number.isFinite(value),
						t("validation.invalid", { ns: "balanceSettings" }),
					)
					.refine(
						(value) => value >= 0,
						t("validation.nonNegative", { ns: "balanceSettings" }),
					),
			}),
		[t],
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
		toast.success(t("toastTitle", { ns: "balanceSettings" }), {
			description: t("toastDescription", {
				ns: "balanceSettings",
				balance: formatCurrency(i18nLanguage, data.balance),
			}),
		});
		closeBalanceSettings();
	});

	return (
		<Dialog open={isOpen} onOpenChange={setBalanceSettingsOpen}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						{t("title", { ns: "balanceSettings" })}
					</DialogTitle>
					<DialogDescription>
						{t("description", { ns: "balanceSettings" })}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-5" noValidate>
					<div className="rounded-2xl border bg-muted/20 p-4">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							{t("currentBalance", { ns: "balanceSettings" })}
						</p>
						<p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
							{formatCurrency(i18nLanguage, balance)}
						</p>
					</div>

					<FormFieldNumber
						control={form.control}
						name="balance"
						label={t("newBalance", { ns: "balanceSettings" })}
						placeholder={formatCurrency(i18nLanguage, 0)}
						minValue={0}
						step={1}
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
							{t("cancel", { ns: "common" })}
						</Button>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{t("save", { ns: "balanceSettings" })}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
