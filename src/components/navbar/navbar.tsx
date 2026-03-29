import { LogOut, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "@/components/navbar/theme-toggle.tsx";
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
import { getInitials } from "@/lib/utils.ts";
import { useTheme } from "@/providers/theme-provider.tsx";
import { useAuthStore } from "@/stores/auth-store";

export const Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const { setTheme } = useTheme();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="ml-auto flex items-center gap-2">
			<ThemeToggle />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-9 w-9 rounded-full">
						<Avatar className="h-9 w-9">
							<AvatarFallback className="bg-primary/10 text-primary">
								{getInitials(user?.name)}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{user?.name || "Usuário"}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.email || "email@exemplo.com"}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Perfil</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={handleLogout}
						className="text-red-600 focus:text-red-600"
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Sair</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
