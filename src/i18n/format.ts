import { APP_CURRENCY, type AppLanguage } from "@/i18n/config";

export const formatCurrency = (language: AppLanguage, value: number) =>
	new Intl.NumberFormat(language, {
		style: "currency",
		currency: APP_CURRENCY,
	}).format(value);

export const formatNumber = (
	language: AppLanguage,
	value: number,
	options?: Intl.NumberFormatOptions,
) => new Intl.NumberFormat(language, options).format(value);

export const formatDate = (
	language: AppLanguage,
	value: Date,
	options: Intl.DateTimeFormatOptions,
) => new Intl.DateTimeFormat(language, options).format(value);
