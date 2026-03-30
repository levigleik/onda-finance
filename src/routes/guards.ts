import { type LoaderFunctionArgs, redirect } from "react-router";
import {
	buildLocalizedPath,
	DEFAULT_ROUTE_LANGUAGE,
	getRouteLanguage,
} from "@/i18n/config";
import { useAuthStore } from "@/stores/auth-store";

const getRouteLanguageFromParams = (lang?: string) =>
	getRouteLanguage(lang) ?? DEFAULT_ROUTE_LANGUAGE;

export const requireAuthLoader = ({ params }: LoaderFunctionArgs) => {
	const { isAuthenticated } = useAuthStore.getState();
	const routeLanguage = getRouteLanguageFromParams(params.lang);

	if (!isAuthenticated) {
		return redirect(buildLocalizedPath(routeLanguage, "/login"));
	}

	return null;
};

export const requireGuestLoader = ({ params }: LoaderFunctionArgs) => {
	const { isAuthenticated } = useAuthStore.getState();
	const routeLanguage = getRouteLanguageFromParams(params.lang);
	if (isAuthenticated) {
		return redirect(buildLocalizedPath(routeLanguage));
	}
	return null;
};
