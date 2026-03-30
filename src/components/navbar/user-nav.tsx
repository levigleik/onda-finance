import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildLocalizedPath } from "@/i18n/config";
import { useAppLanguage } from "@/i18n/use-app-language";
import { getInitials } from "@/lib/utils.ts";
import { useAuthStore } from "@/stores/auth-store";

export const UserNav = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { routeLanguage } = useAppLanguage();
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
		navigate(buildLocalizedPath(routeLanguage, "/login"));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-9 w-9 rounded-full"
					aria-label={t("userMenu.open")}
				>
					<Avatar className="h-9 w-9">
						<AvatarFallback className="bg-primary/10 text-foreground">
							{getInitials(user?.name)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal text-foreground">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user?.name || t("userMenu.fallbackName")}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.email || t("userMenu.fallbackEmail")}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout} variant="destructive">
					<LogOut className="mr-2 h-4 w-4" />
					<span>{t("userMenu.logout")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
