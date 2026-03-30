import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type AppLanguage,
	getRouteLanguageFromAppLanguage,
	I18N_LANGUAGE_TO_ROUTE,
	replacePathLanguage,
} from "@/i18n/config";
import { useAppLanguage } from "@/i18n/use-app-language";

const LANGUAGE_OPTIONS = Object.keys(I18N_LANGUAGE_TO_ROUTE) as AppLanguage[];

export const LanguageSwitcher = () => {
	const { t } = useTranslation("language");
	const navigate = useNavigate();
	const location = useLocation();
	const { i18nLanguage } = useAppLanguage();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="rounded-full gap-2 px-3"
					aria-label={t("openMenu")}
				>
					<Languages className="h-4 w-4" />
					<span className="text-xs font-semibold uppercase tracking-[0.18em]">
						{i18nLanguage.toUpperCase()}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={i18nLanguage}
					onValueChange={(nextLanguage) => {
						const nextRouteLanguage = getRouteLanguageFromAppLanguage(
							nextLanguage,
						);
						const nextPathname = replacePathLanguage(
							location.pathname,
							nextRouteLanguage,
						);

						navigate(`${nextPathname}${location.search}${location.hash}`);
					}}
				>
					{LANGUAGE_OPTIONS.map((language) => (
						<DropdownMenuRadioItem key={language} value={language}>
							{t(`options.${language}`)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
