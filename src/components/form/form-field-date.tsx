import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
	type PathValue,
} from "react-hook-form";
import type { Locale } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const defaultParseDateValue = (value: unknown) => {
	if (!value) {
		return undefined;
	}

	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? undefined : value;
	}

	if (typeof value !== "string") {
		return undefined;
	}

	const normalizedValue = DATE_ONLY_PATTERN.test(value)
		? `${value}T00:00:00`
		: value;
	const date = new Date(normalizedValue);

	return Number.isNaN(date.getTime()) ? undefined : date;
};

const defaultSerializeDateValue = <T extends FieldValues>(date: Date) =>
	format(date, "yyyy-MM-dd") as PathValue<T, Path<T>>;

interface FormFieldDateProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	description?: string;
	placeholder?: string;
	fieldClassName?: string;
	className?: string;
	disabled?: boolean;
	locale?: Locale;
	calendarProps?: Omit<
		React.ComponentProps<typeof Calendar>,
		"captionLayout" | "locale" | "mode" | "onSelect" | "selected"
	>;
	parseValue?: (value: PathValue<T, Path<T>> | undefined) => Date | undefined;
	serializeValue?: (date: Date) => PathValue<T, Path<T>>;
}

export function FormFieldDate<T extends FieldValues>({
	control,
	name,
	label,
	description,
	placeholder = "Selecione uma data",
	fieldClassName,
	className,
	disabled = false,
	locale = ptBR,
	calendarProps,
	parseValue = defaultParseDateValue,
	serializeValue = defaultSerializeDateValue<T>,
}: FormFieldDateProps<T>) {
	const [open, setOpen] = useState(false);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const selectedDate = parseValue(
					field.value as PathValue<T, Path<T>> | undefined,
				);

				return (
					<Field className={fieldClassName} data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
						<FieldContent>
							<Popover
								open={open}
								onOpenChange={(nextOpen) => {
									setOpen(nextOpen);

									if (!nextOpen) {
										field.onBlur();
									}
								}}
							>
								<PopoverTrigger asChild>
									<Button
										id={field.name}
										type="button"
										variant="outline"
										disabled={disabled}
										aria-invalid={fieldState.invalid}
										className={cn(
											"h-10 w-full justify-start bg-popover text-left font-normal",
											!selectedDate && "text-muted-foreground",
											className,
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{selectedDate ? (
											format(selectedDate, "PPP", { locale })
										) : (
											<span>{placeholder}</span>
										)}
									</Button>
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										{...calendarProps}
										mode="single"
										locale={locale}
										captionLayout="dropdown"
										selected={selectedDate}
										onSelect={(date) => {
											if (!date) {
												return;
											}

											field.onChange(serializeValue(date));
											field.onBlur();
											setOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>

							{description ? (
								<FieldDescription>{description}</FieldDescription>
							) : null}

							{fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
						</FieldContent>
					</Field>
				);
			}}
		/>
	);
}
