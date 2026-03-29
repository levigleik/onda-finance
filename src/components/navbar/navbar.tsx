import { ThemeToggle } from "@/components/navbar/theme-toggle.tsx";
import { UserNav } from "@/components/navbar/user-nav.tsx";

export const Navbar = () => {
	return (
		<div className="ml-auto flex items-center gap-2">
			<ThemeToggle />
			<UserNav />
		</div>
	);
};
