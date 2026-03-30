import { Settings2 } from "lucide-react";
import { BalanceSettingsDialog } from "@/components/navbar/balance-settings-dialog.tsx";
import { LanguageSwitcher } from "@/components/navbar/language-switcher";
import { ThemeToggle } from "@/components/navbar/theme-toggle.tsx";
import { UserNav } from "@/components/navbar/user-nav.tsx";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useBalanceSettingsStore } from "@/stores/balance-settings-store";

export const Navbar = () => {
	const { t } = useTranslation();
	const openBalanceSettings = useBalanceSettingsStore(
		(state) => state.openBalanceSettings,
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
					aria-label={t("nav.openBalanceSettings")}
				>
					<Settings2 className="h-4 w-4" />
				</Button>
				<LanguageSwitcher />
				<ThemeToggle />
				<UserNav />
			</div>
			<BalanceSettingsDialog />
		</>
	);
};
