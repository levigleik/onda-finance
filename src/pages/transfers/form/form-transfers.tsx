import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { type DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Stepper, StepperContent, StepperPanel } from "@/components/ui/stepper";
import { formatCurrency, formatDate } from "@/i18n/format";
import { useAppLanguage } from "@/i18n/use-app-language";
import { TransfersFormStep1 } from "@/pages/transfers/components/transfers-form-step-1";
import { TransfersFormStep2 } from "@/pages/transfers/components/transfers-form-step-2";
import {
	TransfersStepperNav,
	transferStepperIndicators,
} from "@/pages/transfers/components/transfers-stepper-nav";
import {
	createTransferFormSchema,
	createTransferRecipientSchema,
	getInsufficientBalanceMessage,
	type TransfersFormValues,
	type TransferTiming,
	transferRecipientFields,
} from "@/pages/transfers/validations/validations-transfers";
import { useAuthStore } from "@/stores/auth-store";
import { useTransfersStore } from "@/stores/transfers-store";

const getTodayDate = () => format(new Date(), "yyyy-MM-dd");

const buildDefaultValues = (): DefaultValues<TransfersFormValues> => ({
	recipientName: "",
	recipientEmail: "",
	recipientDocument: "",
	amount: undefined,
	transferTiming: "now",
	transferDate: getTodayDate(),
	description: "",
});

interface FormTransfersProps {
	onSuccess?: () => void;
}

export const FormTransfers = ({ onSuccess }: FormTransfersProps) => {
	const { t } = useTranslation();
	const { i18nLanguage } = useAppLanguage();
	const [activeStep, setActiveStep] = useState(1);

	const user = useAuthStore((state) => state.user);
	const balance = useAuthStore((state) => state.balance);
	const debitBalance = useAuthStore((state) => state.debitBalance);
	const createTransfer = useTransfersStore((state) => state.createTransfer);
	const recipientValidationSchema = useMemo(
		() => createTransferRecipientSchema(t),
		[t],
	);
	const validationSchema = useMemo(
		() => createTransferFormSchema(balance, t, i18nLanguage),
		[balance, i18nLanguage, t],
	);

	const form = useForm<TransfersFormValues>({
		resolver: zodResolver(validationSchema),
		defaultValues: buildDefaultValues(),
		mode: "onChange",
	});

	const values = form.watch();

	const isRecipientStepComplete = recipientValidationSchema.safeParse({
		recipientName: values.recipientName,
		recipientEmail: values.recipientEmail,
		recipientDocument: values.recipientDocument,
	}).success;

	const isFormReadyToSubmit =
		validationSchema.safeParse(values).success && Boolean(user);

	useEffect(() => {
		void form.trigger("amount");
	}, [balance, form]);

	const handleStepChange = async (nextStep: number) => {
		if (nextStep === activeStep) {
			return;
		}

		if (nextStep < activeStep) {
			setActiveStep(nextStep);
			return;
		}

		const isCurrentStepValid = await form.trigger(transferRecipientFields, {
			shouldFocus: true,
		});

		if (isCurrentStepValid) {
			setActiveStep(nextStep);
		}
	};

	const handleContinue = async () => {
		const isCurrentStepValid = await form.trigger(transferRecipientFields, {
			shouldFocus: true,
		});

		if (isCurrentStepValid) {
			setActiveStep(2);
		}
	};

	const handleSubmit = form.handleSubmit(async (data) => {
		if (!user) {
			return;
		}

		if (typeof data.amount !== "number") {
			return;
		}

		const transferDate =
			data.transferTiming === "now"
				? getTodayDate()
				: (data.transferDate ?? "");
		const latestBalance = useAuthStore.getState().balance;

		if (data.amount > latestBalance) {
			form.setError("amount", {
				type: "manual",
				message: getInsufficientBalanceMessage(latestBalance, t, i18nLanguage),
			});
			return;
		}

		const createdTransfer = await createTransfer({
			sender: {
				name: user.name,
				email: user.email,
			},
			recipient: {
				name: data.recipientName,
				email: data.recipientEmail,
				document: data.recipientDocument,
			},
			amount: data.amount,
			transferDate,
			description: data.description,
		});
		debitBalance(data.amount);

		toast.success(t("transfers.toast.successTitle"), {
			description:
				data.transferTiming === "now"
					? t("transfers.toast.successToday", {
							recipient: createdTransfer.recipient.name,
							amount: formatCurrency(i18nLanguage, createdTransfer.amount),
						})
					: t("transfers.toast.successScheduled", {
							recipient: createdTransfer.recipient.name,
							amount: formatCurrency(i18nLanguage, createdTransfer.amount),
							date: formatDate(
								i18nLanguage,
								new Date(`${createdTransfer.transferDate}T00:00:00`),
								{
									day: "2-digit",
									month: "long",
									year: "numeric",
								},
							),
						}),
		});

		form.reset(buildDefaultValues());
		setActiveStep(1);
		onSuccess?.();
	});

	const handleTransferTimingChange = (timing: TransferTiming) => {
		if (timing === "now") {
			form.setValue("transferTiming", "now", {
				shouldDirty: true,
				shouldValidate: true,
			});
			form.setValue("transferDate", getTodayDate(), {
				shouldDirty: true,
				shouldValidate: true,
			});
			return;
		}

		form.setValue("transferTiming", "scheduled", {
			shouldDirty: true,
			shouldValidate: true,
		});
		form.setValue("transferDate", undefined, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} noValidate className="space-y-6">
				<Stepper
					value={activeStep}
					onValueChange={(step) => {
						void handleStepChange(step);
					}}
					className="space-y-6"
					indicators={transferStepperIndicators}
				>
					<TransfersStepperNav
						activeStep={activeStep}
						isRecipientStepComplete={isRecipientStepComplete}
						isSubmitting={form.formState.isSubmitting}
					/>

					<StepperPanel>
						<StepperContent
							value={1}
							className="animate-in fade-in slide-in-from-bottom-4"
						>
							<TransfersFormStep1
								control={form.control}
								senderName={user?.name}
								senderEmail={user?.email}
								onContinue={handleContinue}
							/>
						</StepperContent>

						<StepperContent
							value={2}
							className="animate-in fade-in slide-in-from-right-4"
						>
							<TransfersFormStep2
								control={form.control}
								senderName={user?.name}
								senderEmail={user?.email}
								values={values}
								availableBalance={balance}
								onTransferTimingChange={handleTransferTimingChange}
								onBack={() => setActiveStep(1)}
								isSubmitting={form.formState.isSubmitting}
								isSubmitDisabled={!isFormReadyToSubmit}
							/>
						</StepperContent>
					</StepperPanel>
				</Stepper>
			</form>
		</div>
	);
};
