import { enUS, ptBR } from "date-fns/locale";
import type { Locale } from "react-day-picker";

export const LANGUAGE_ROUTE_ID = "language";
export const DEFAULT_ROUTE_LANGUAGE = "pt-br";
export const DEFAULT_LANGUAGE = "pt-BR";
export const DEFAULT_NAMESPACE = "common";
export const APP_CURRENCY = "BRL";

export const ROUTE_LANGUAGE_TO_I18N = {
	"pt-br": "pt-BR",
	"en-us": "en-US",
} as const;

export const I18N_LANGUAGE_TO_ROUTE = {
	"pt-BR": "pt-br",
	"en-US": "en-us",
} as const;

const DATE_FNS_LOCALES = {
	"pt-BR": ptBR,
	"en-US": enUS,
} as const satisfies Record<AppLanguage, Locale>;

export type RouteLanguage = keyof typeof ROUTE_LANGUAGE_TO_I18N;
export type AppLanguage = (typeof ROUTE_LANGUAGE_TO_I18N)[RouteLanguage];

export const SUPPORTED_ROUTE_LANGUAGES = Object.keys(
	ROUTE_LANGUAGE_TO_I18N,
) as RouteLanguage[];

export const SUPPORTED_LANGUAGES = Object.values(
	ROUTE_LANGUAGE_TO_I18N,
) as AppLanguage[];

export const getRouteLanguage = (value?: string | null): RouteLanguage | null => {
	if (!value) {
		return null;
	}

	const normalizedValue = value.toLowerCase();

	return normalizedValue in ROUTE_LANGUAGE_TO_I18N
		? (normalizedValue as RouteLanguage)
		: null;
};

export const getAppLanguage = (value?: string | null): AppLanguage | null => {
	if (!value) {
		return null;
	}

	const normalizedValue = value.replaceAll("_", "-").toLowerCase();

	switch (normalizedValue) {
		case "pt":
		case "pt-br":
			return "pt-BR";
		case "en":
		case "en-us":
			return "en-US";
		default:
			return null;
	}
};

export const getRouteLanguageFromAppLanguage = (
	value?: string | null,
): RouteLanguage =>
	I18N_LANGUAGE_TO_ROUTE[getAppLanguage(value) ?? DEFAULT_LANGUAGE];

export const getAppLanguageFromRouteLanguage = (
	value?: string | null,
): AppLanguage =>
	ROUTE_LANGUAGE_TO_I18N[getRouteLanguage(value) ?? DEFAULT_ROUTE_LANGUAGE];

export const getDateFnsLocale = (language: AppLanguage) =>
	DATE_FNS_LOCALES[language];

export const buildLocalizedPath = (
	routeLanguage: RouteLanguage,
	path = "/",
) => {
	if (!path || path === "/") {
		return `/${routeLanguage}`;
	}

	const normalizedPath = path.startsWith("/") ? path : `/${path}`;

	return `/${routeLanguage}${normalizedPath}`;
};

export const stripLanguageFromPath = (pathname: string) => {
	const segments = pathname.split("/").filter(Boolean);
	const routeLanguage = getRouteLanguage(segments[0]);

	if (!routeLanguage) {
		return pathname || "/";
	}

	const remainingPath = segments.slice(1).join("/");

	return remainingPath ? `/${remainingPath}` : "/";
};

export const replacePathLanguage = (
	pathname: string,
	nextRouteLanguage: RouteLanguage,
) => buildLocalizedPath(nextRouteLanguage, stripLanguageFromPath(pathname));

export const replaceLeadingSegmentWithLanguage = (
	pathname: string,
	nextRouteLanguage: RouteLanguage,
) => {
	const segments = pathname.split("/").filter(Boolean);

	if (segments.length === 0) {
		return buildLocalizedPath(nextRouteLanguage);
	}

	const remainingPath = segments.slice(1).join("/");

	return buildLocalizedPath(
		nextRouteLanguage,
		remainingPath ? `/${remainingPath}` : "/",
	);
};
