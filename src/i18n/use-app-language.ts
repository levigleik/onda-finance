import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
	DEFAULT_LANGUAGE,
	DEFAULT_ROUTE_LANGUAGE,
	getAppLanguage,
	getDateFnsLocale,
	getRouteLanguage,
	getRouteLanguageFromAppLanguage,
} from "@/i18n/config";

export const useAppLanguage = () => {
	const { i18n } = useTranslation();
	const params = useParams();
	const i18nLanguage = getAppLanguage(i18n.resolvedLanguage) ?? DEFAULT_LANGUAGE;
	const routeLanguage =
		getRouteLanguage(params.lang) ??
		getRouteLanguageFromAppLanguage(i18nLanguage) ??
		DEFAULT_ROUTE_LANGUAGE;

	return {
		routeLanguage,
		i18nLanguage,
		dateLocale: getDateFnsLocale(i18nLanguage),
	};
};
