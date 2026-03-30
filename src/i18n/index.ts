import i18n, { type ResourceLanguage } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import {
	DEFAULT_LANGUAGE,
	DEFAULT_NAMESPACE,
	type AppLanguage,
	SUPPORTED_LANGUAGES,
	TRANSLATION_NAMESPACES,
} from "@/i18n/config";

const translationModules = import.meta.glob<{ default: ResourceLanguage }>(
	"./locales/*/*.json",
);

export const i18nInitializationPromise = i18n
	.use(initReactI18next)
	.use(
		resourcesToBackend((language: string, namespace: string) => {
			const loader =
				translationModules[`./locales/${language}/${namespace}.json`];

			if (!loader) {
				return Promise.reject(
					new Error(
						`Translation file not found for ${language}/${namespace}.json`,
					),
				);
			}

			return loader().then((module) => module.default);
		}),
	)
	.init({
		lng: DEFAULT_LANGUAGE,
		fallbackLng: DEFAULT_LANGUAGE,
		defaultNS: DEFAULT_NAMESPACE,
		ns: [...TRANSLATION_NAMESPACES],
		supportedLngs: SUPPORTED_LANGUAGES,
		load: "currentOnly",
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: true,
		},
	});

export const ensureI18nLanguage = async (language: AppLanguage) => {
	await i18nInitializationPromise;

	if (i18n.resolvedLanguage !== language) {
		await i18n.changeLanguage(language);
		return;
	}

	await i18n.loadLanguages(language);
};

export default i18n;
