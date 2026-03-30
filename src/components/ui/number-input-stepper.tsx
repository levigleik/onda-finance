"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
	Button,
	Group,
	Input,
	NumberField,
	type NumberFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

interface NumberInputStepperProps extends NumberFieldProps {
	showStepper?: boolean;
	className?: string;
	showStepperOnHover?: boolean;
	placeholder?: string;
	maxLength?: number;
	inputProps?: ComponentProps<typeof Input>;
}

export default function NumberInputStepper({
	placeholder = "0",
	className,
	value: controlledValue,
	defaultValue = 0,
	onChange: onValueChange,
	showStepper = true,
	showStepperOnHover = false,
	minValue = 0,
	maxLength,
	isDisabled: disabled,
	inputProps,
	...props
}: NumberInputStepperProps) {
	const [value, setValue] = useControllableState({
		prop: controlledValue,
		defaultProp: defaultValue,
		onChange: onValueChange,
	});

	return (
		<NumberField
			aria-label="number-field"
			value={value}
			onChange={setValue}
			minValue={minValue}
			isDisabled={disabled}
			{...props}
		>
			<Group
				className={cn(
					"group outline-none relative inline-flex h-10 w-full items-center bg-popover overflow-hidden rounded-md border border-input text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40",
					className,
				)}
			>
				<Input
					{...inputProps}
					placeholder={placeholder}
					className={cn(
						"w-full min-w-0 bg-transparent px-3 py-2 text-foreground tabular-nums focus-visible:outline-none",
						inputProps?.className,
					)}
					maxLength={maxLength}
				/>

				{showStepper && (
					<div
						className={cn(
							"flex h-[calc(100%+2px)] flex-col",
							showStepperOnHover
								? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
								: "opacity-100",
						)}
					>
						<Button
							slot="increment"
							className="-me-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<ChevronUpIcon size={12} aria-hidden="true" />
						</Button>
						<Button
							slot="decrement"
							className="-me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border border-input text-sm text-muted-foreground/80 transition-[color,box-shadow] hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							<ChevronDownIcon size={12} aria-hidden="true" />
						</Button>
					</div>
				)}
			</Group>
		</NumberField>
	);
}
