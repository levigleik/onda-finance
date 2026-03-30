import { Settings2 } from "lucide-react";
import { BalanceSettingsDialog } from "@/components/navbar/balance-settings-dialog.tsx";
import { ThemeToggle } from "@/components/navbar/theme-toggle.tsx";
import { UserNav } from "@/components/navbar/user-nav.tsx";
import { Button } from "@/components/ui/button";
import { useBalanceSettingsStore } from "@/stores/balance-settings-store";

export const Navbar = () => {
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
					aria-label="Abrir configurações de saldo"
				>
					<Settings2 className="h-4 w-4" />
				</Button>
				<ThemeToggle />
				<UserNav />
			</div>
			<BalanceSettingsDialog />
		</>
	);
};
