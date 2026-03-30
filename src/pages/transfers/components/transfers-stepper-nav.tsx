import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
} from "@/components/ui/stepper";

const steps = [
	{ step: 1, titleKey: "transfers.stepper.recipient" },
	{ step: 2, titleKey: "transfers.stepper.amountAndDate" },
];

interface TransfersStepperNavProps {
	activeStep: number;
	isRecipientStepComplete: boolean;
	isSubmitting: boolean;
}

export const transferStepperIndicators = {
	completed: <CheckIcon className="size-4" />,
	loading: <LoaderCircleIcon className="size-4 animate-spin" />,
};

export const TransfersStepperNav = ({
	activeStep,
	isRecipientStepComplete,
	isSubmitting,
}: TransfersStepperNavProps) => {
	const { t } = useTranslation();

	return (
		<div className="mx-auto max-w-2xl">
			<StepperNav>
				{steps.map((step, index) => (
					<StepperItem
						key={step.step}
						step={step.step}
						completed={
							step.step === 1 && activeStep > 1 && isRecipientStepComplete
						}
						loading={step.step === 2 && isSubmitting}
						className="relative flex-1 items-start"
					>
						<div className="flex flex-col gap-2.5">
							<StepperIndicator>{step.step}</StepperIndicator>
							<StepperTitle className="text-xs font-bold uppercase tracking-[0.22em]">
								{t(step.titleKey)}
							</StepperTitle>
						</div>

						{steps.length > index + 1 ? (
							<StepperSeparator className="absolute inset-x-0 top-4 left-2/5 m-0 group-data-[state=completed]/step:bg-primary group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
						) : null}
					</StepperItem>
				))}
			</StepperNav>
		</div>
	);
};
