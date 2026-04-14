import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Settings2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/navbar/language-switcher";
import { ThemeToggle } from "@/components/navbar/theme-toggle.tsx";
import { UserNav } from "@/components/navbar/user-nav.tsx";
import { Button } from "@/components/ui/button";
import { useBalanceSettingsStore } from "@/stores/balance-settings-store";

const LazyBalanceSettingsDialog = lazy(async () => {
	const module = await import("@/components/navbar/balance-settings-dialog.tsx");

	return { default: module.BalanceSettingsDialog };
});

export const Navbar = () => {
	const { t } = useTranslation("nav");
	const openBalanceSettings = useBalanceSettingsStore(
		(state) => state.openBalanceSettings,
	);
	const isBalanceSettingsOpen = useBalanceSettingsStore(
		(state) => state.isBalanceSettingsOpen,
	);

	return (
		<>
			<div className="ml-auto flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="rounded-full"
					onClick={openBalanceSettings}
					aria-label={t("openBalanceSettings")}
				>
					<Settings2 className="h-4 w-4" />
				</Button>
				<LanguageSwitcher />
				<ThemeToggle />
				<UserNav />
			</div>
			{isBalanceSettingsOpen ? (
				<Suspense fallback={null}>
					<LazyBalanceSettingsDialog />
				</Suspense>
			) : null}
		</>
	);
};
