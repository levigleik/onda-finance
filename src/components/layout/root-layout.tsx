import { Outlet } from "react-router";
import { Navbar } from "@/components/navbar/navbar.tsx";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
export const RootLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="flex min-h-screen w-full flex-col bg-background font-sans text-foreground">
				<header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 shadow-sm md:px-6">
					<SidebarTrigger />
					<Navbar />
				</header>

				<main className="flex-1 p-4 md:p-6 overflow-auto">
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	);
};
