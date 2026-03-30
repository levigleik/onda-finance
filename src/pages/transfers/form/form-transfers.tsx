import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { type DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import type {
	TransferModalInitialStep,
	TransferModalRecipientPreset,
} from "@/stores/transfer-modal-store";
import { useTransfersStore } from "@/stores/transfers-store";

const getTodayDate = () => format(new Date(), "yyyy-MM-dd");
const maskRecipientDocument = (value?: string) => {
	const digits = value?.replace(/\D/g, "").slice(0, 11) ?? "";

	if (!digits) {
		return "";
	}

	return digits
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const buildDefaultValues = (
	recipientPreset?: TransferModalRecipientPreset | null,
): DefaultValues<TransfersFormValues> => ({
	recipientName: recipientPreset?.name ?? "",
	recipientEmail: recipientPreset?.email ?? "",
	recipientDocument: maskRecipientDocument(recipientPreset?.document),
	amount: undefined,
	transferTiming: "now",
	transferDate: getTodayDate(),
	description: "",
});

interface FormTransfersProps {
	onSuccess?: () => void;
	onDismissLockChange?: (locked: boolean) => void;
	recipientPreset?: TransferModalRecipientPreset | null;
	initialStep?: TransferModalInitialStep;
}

export const FormTransfers = ({
	onSuccess,
	onDismissLockChange,
	recipientPreset,
	initialStep = 1,
}: FormTransfersProps) => {
	const { t } = useTranslation("transfers");
	const { i18nLanguage } = useAppLanguage();
	const [activeStep, setActiveStep] =
		useState<TransferModalInitialStep>(initialStep);

	const user = useAuthStore((state) => state.user);
	const balance = useAuthStore((state) => state.balance);
	const debitBalance = useAuthStore((state) => state.debitBalance);
	const createTransfer = useTransfersStore((state) => state.createTransfer);
	const defaultValues = useMemo(
		() => buildDefaultValues(recipientPreset),
		[recipientPreset],
	);
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
		defaultValues,
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
		const amountValue = form.getValues("amount");
		const amountFieldState = form.getFieldState("amount");
		const hasAmount =
			typeof amountValue === "number" && Number.isFinite(amountValue);
		const shouldRevalidateAmount =
			hasAmount || amountFieldState.isTouched || amountFieldState.invalid;

		if (!shouldRevalidateAmount) {
			return;
		}

		if (hasAmount) {
			form.setValue("amount", amountValue, {
				shouldDirty: amountFieldState.isDirty,
				shouldTouch: amountFieldState.isTouched,
				shouldValidate: true,
			});
			return;
		}

		void form.trigger("amount");
	}, [balance, form]);

	useEffect(() => {
		onDismissLockChange?.(isFormReadyToSubmit);
	}, [isFormReadyToSubmit, onDismissLockChange]);

	useEffect(() => {
		form.reset(defaultValues);
		setActiveStep(initialStep);
		onDismissLockChange?.(false);
	}, [defaultValues, form, initialStep, onDismissLockChange]);

	useEffect(
		() => () => {
			onDismissLockChange?.(false);
		},
		[onDismissLockChange],
	);

	const handleStepChange = async (nextStep: number) => {
		const targetStep: TransferModalInitialStep = nextStep === 2 ? 2 : 1;

		if (targetStep === activeStep) {
			return;
		}

		if (targetStep < activeStep) {
			setActiveStep(targetStep);
			return;
		}

		const isCurrentStepValid = await form.trigger(transferRecipientFields, {
			shouldFocus: true,
		});

		if (isCurrentStepValid) {
			setActiveStep(targetStep);
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

		toast.success(t("toast.successTitle"), {
			description:
				data.transferTiming === "now"
					? t("toast.successToday", {
							recipient: createdTransfer.recipient.name,
							amount: formatCurrency(i18nLanguage, createdTransfer.amount),
						})
					: t("toast.successScheduled", {
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
		onDismissLockChange?.(false);
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
		<div className="grid h-full min-h-0 overflow-hidden gap-6">
			<form
				onSubmit={handleSubmit}
				noValidate
				className="grid h-full min-h-0 overflow-hidden gap-6"
			>
				<Stepper
					value={activeStep}
					onValueChange={(step) => {
						void handleStepChange(step);
					}}
					className="h-full min-h-0 gap-6 overflow-hidden flex items-center flex-col"
					indicators={transferStepperIndicators}
				>
					<TransfersStepperNav
						activeStep={activeStep}
						isRecipientStepComplete={isRecipientStepComplete}
						isSubmitting={form.formState.isSubmitting}
					/>

					<StepperPanel className="h-full min-h-0 overflow-hidden">
						<StepperContent
							value={1}
							className="grid h-full min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
						>
							<ScrollArea className="h-full min-h-0" viewportClassName="h-full">
								<div className="pr-1">
									<TransfersFormStep1
										control={form.control}
										senderName={user?.name}
										senderEmail={user?.email}
										onContinue={handleContinue}
									/>
								</div>
							</ScrollArea>
						</StepperContent>

						<StepperContent
							value={2}
							className="grid h-full min-h-0 overflow-hidden animate-in fade-in slide-in-from-right-4"
						>
							<ScrollArea className="h-full min-h-0" viewportClassName="h-full">
								<div className="pr-1">
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
								</div>
							</ScrollArea>
						</StepperContent>
					</StepperPanel>
				</Stepper>
			</form>
		</div>
	);
};
