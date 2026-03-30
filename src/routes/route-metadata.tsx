import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router";
import type { TranslationNamespace } from "@/i18n/config";

export interface AppRouteMeta {
	namespace: TranslationNamespace;
	titleKey: string;
	descriptionKey: string;
}

export interface AppRouteHandle {
	meta?: AppRouteMeta;
}

const ensureMetaTag = (attribute: "name" | "property", value: string) => {
	let meta = document.head.querySelector<HTMLMetaElement>(
		`meta[${attribute}="${value}"]`,
	);

	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute(attribute, value);
		document.head.appendChild(meta);
	}

	return meta;
};

export const RouteMetadataSync = () => {
	const matches = useMatches();
	const activeMeta = useMemo(() => {
		for (const match of [...matches].reverse()) {
			const handle = match.handle as AppRouteHandle | undefined;

			if (handle?.meta) {
				return handle.meta;
			}
		}

		return null;
	}, [matches]);
	const namespaces = activeMeta
		? (["app", activeMeta.namespace] as const)
		: (["app"] as const);
	const { i18n, t } = useTranslation(namespaces);

	const appName = t("name", { ns: "app" });
	const siteName = t("seo.ogSiteName", { ns: "app" });
	const defaultDescription = t("seo.defaultDescription", { ns: "app" });
	const pageTitle = activeMeta
		? t(activeMeta.titleKey, { ns: activeMeta.namespace })
		: appName;
	const pageDescription = activeMeta
		? t(activeMeta.descriptionKey, { ns: activeMeta.namespace })
		: defaultDescription;

	useEffect(() => {
		document.title = activeMeta ? `${pageTitle} | ${appName}` : appName;

		ensureMetaTag("name", "description").setAttribute("content", pageDescription);
		ensureMetaTag("property", "og:title").setAttribute(
			"content",
			activeMeta ? `${pageTitle} | ${appName}` : appName,
		);
		ensureMetaTag("property", "og:description").setAttribute(
			"content",
			pageDescription,
		);
		ensureMetaTag("property", "og:type").setAttribute("content", "website");
		ensureMetaTag("property", "og:site_name").setAttribute("content", siteName);
		ensureMetaTag("property", "og:locale").setAttribute(
			"content",
			(i18n.resolvedLanguage ?? "pt-BR").replace("-", "_"),
		);
	}, [activeMeta, appName, i18n.resolvedLanguage, pageDescription, pageTitle, siteName]);

	return null;
};
