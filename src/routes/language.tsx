import { useEffect } from "react";
import {
	Outlet,
	redirect,
	type LoaderFunctionArgs,
	useLoaderData,
	useRouteLoaderData,
} from "react-router";
import i18n, { ensureI18nLanguage } from "@/i18n";
import {
	DEFAULT_LANGUAGE,
	DEFAULT_ROUTE_LANGUAGE,
	LANGUAGE_ROUTE_ID,
	type AppLanguage,
	type RouteLanguage,
	getAppLanguageFromRouteLanguage,
	getRouteLanguage,
	replaceLeadingSegmentWithLanguage,
} from "@/i18n/config";
import { RouteMetadataSync } from "@/routes/route-metadata";

export interface LanguageLoaderData {
	routeLanguage: RouteLanguage;
	i18nLanguage: AppLanguage;
}

export const languageLoader = async ({
	params,
	request,
}: LoaderFunctionArgs): Promise<LanguageLoaderData> => {
	const url = new URL(request.url);
	const routeLanguage = getRouteLanguage(params.lang);

	if (!routeLanguage) {
		return redirectToDefaultLanguage(url);
	}

	if (params.lang !== routeLanguage) {
		url.pathname = replaceLeadingSegmentWithLanguage(url.pathname, routeLanguage);
		throw redirect(`${url.pathname}${url.search}`);
	}

	const i18nLanguage = getAppLanguageFromRouteLanguage(routeLanguage);

	await ensureI18nLanguage(i18nLanguage);

	return {
		routeLanguage,
		i18nLanguage,
	};
};

const redirectToDefaultLanguage = (url: URL): never => {
	url.pathname = replaceLeadingSegmentWithLanguage(
		url.pathname,
		DEFAULT_ROUTE_LANGUAGE,
	);

	throw redirect(`${url.pathname}${url.search}`);
};

export const LanguageLayout = () => {
	const { i18nLanguage } = useLoaderData() as LanguageLoaderData;

	useEffect(() => {
		document.documentElement.lang = i18nLanguage;
		void i18n.changeLanguage(i18nLanguage);
	}, [i18nLanguage]);

	return (
		<>
			<RouteMetadataSync />
			<Outlet />
		</>
	);
};

export const useLanguageRouteData = (): LanguageLoaderData => {
	const data = useRouteLoaderData(LANGUAGE_ROUTE_ID) as
		| LanguageLoaderData
		| undefined;

	return (
		data ?? {
			routeLanguage: DEFAULT_ROUTE_LANGUAGE,
			i18nLanguage: DEFAULT_LANGUAGE,
		}
	);
};
