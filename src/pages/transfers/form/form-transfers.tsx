import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { type DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Stepper, StepperContent, StepperPanel } from "@/components/ui/stepper";
import { TransfersFormStep1 } from "@/pages/transfers/components/transfers-form-step-1";
import { TransfersFormStep2 } from "@/pages/transfers/components/transfers-form-step-2";
import {
	TransfersStepperNav,
	transferStepperIndicators,
} from "@/pages/transfers/components/transfers-stepper-nav";
import {
	type TransfersFormValues,
	type TransferTiming,
	transferFormSchema,
	transferRecipientFields,
	transferRecipientSchema,
} from "@/pages/transfers/validations/validations-transfers";
import { useAuthStore } from "@/stores/auth-store";
import { useTransfersStore } from "@/stores/transfers-store";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "long",
	year: "numeric",
});

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

export const FormTransfers = () => {
	const [activeStep, setActiveStep] = useState(1);

	const user = useAuthStore((state) => state.user);
	const createTransfer = useTransfersStore((state) => state.createTransfer);

	const form = useForm<TransfersFormValues>({
		resolver: zodResolver(transferFormSchema),
		defaultValues: buildDefaultValues(),
		mode: "onChange",
	});

	const values = form.watch();

	const isRecipientStepComplete = transferRecipientSchema.safeParse({
		recipientName: values.recipientName,
		recipientEmail: values.recipientEmail,
		recipientDocument: values.recipientDocument,
	}).success;

	const isFormReadyToSubmit =
		transferFormSchema.safeParse(values).success && Boolean(user);

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

		const transferDate =
			data.transferTiming === "now"
				? getTodayDate()
				: (data.transferDate ?? "");

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

		toast.success("Transferência realizada com sucesso.", {
			description:
				`${createdTransfer.recipient.name} receberá ${currencyFormatter.format(createdTransfer.amount)} ` +
				`${
					data.transferTiming === "now"
						? "hoje"
						: `no dia ${dateFormatter.format(
								new Date(`${createdTransfer.transferDate}T00:00:00`),
							)}`
				}.`,
		});

		form.reset(buildDefaultValues());
		setActiveStep(1);
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
