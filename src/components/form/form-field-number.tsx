import type { ComponentProps } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useController } from "react-hook-form";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import NumberInputStepper from "../ui/number-input-stepper";

interface FormFieldNumberProps<T extends FieldValues>
	extends ComponentProps<typeof NumberInputStepper> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	ariaLabel?: string;
	onValueChange?: (value: number) => void;
	formItemClassName?: string;
}

export function FormFieldNumber<T extends FieldValues>({
	control,
	name,
	label,
	ariaLabel,
	onValueChange,
	formItemClassName,
	...props
}: FormFieldNumberProps<T>) {
	const {
		field,
		fieldState: { error },
	} = useController({
		control,
		name,
	});

	return (
		<Field className={cn("w-full", formItemClassName)} data-invalid={!!error}>
			{label && <FieldLabel>{label}</FieldLabel>}

			<FieldContent>
				<NumberInputStepper
					value={field.value}
					onChange={field.onChange}
					ariaLabel={ariaLabel ?? label}
					className={cn(error && "border-destructive dark:border-destructive")}
					inputProps={{
						...props.inputProps,
						className: cn(
							props.inputProps?.className,
							error && "border-destructive dark:border-destructive",
						),
						onBlur: (e) => {
							const parsed = Number(e.target.value);

							if (!Number.isNaN(parsed)) {
								onValueChange?.(parsed);
							}

							props.inputProps?.onBlur?.(e);
							field.onBlur();
						},
					}}
					{...props}
				/>
				<FieldError errors={error ? [error] : undefined} />
			</FieldContent>
		</Field>
	);
}
