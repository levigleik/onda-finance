import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldTextProps<T extends FieldValues>
	extends Omit<
		React.ComponentProps<typeof Input>,
		"defaultValue" | "name" | "onChange" | "value"
	> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	description?: string;
	fieldClassName?: string;
	parseAs?: "string" | "number";
	transformValue?: (value: string) => string;
}

export function FormFieldText<T extends FieldValues>({
	control,
	name,
	label,
	description,
	fieldClassName,
	parseAs = "string",
	transformValue,
	className,
	type,
	...props
}: FormFieldTextProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field className={fieldClassName} data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<FieldContent>
						<Input
							{...props}
							id={field.name}
							name={field.name}
							type={type}
							value={field.value ?? ""}
							aria-invalid={fieldState.invalid}
							className={cn("h-10 bg-popover", className)}
							onChange={(event) => {
								if (parseAs === "number") {
									field.onChange(
										event.target.value === ""
											? undefined
											: Number(event.target.value),
									);
									return;
								}

								field.onChange(
									transformValue
										? transformValue(event.target.value)
										: event.target.value,
								);
							}}
							onBlur={field.onBlur}
						/>

						{description ? (
							<FieldDescription>{description}</FieldDescription>
						) : null}

						{fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
					</FieldContent>
				</Field>
			)}
		/>
	);
}
