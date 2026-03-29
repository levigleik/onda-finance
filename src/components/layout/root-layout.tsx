import { Outlet } from "react-router";
import { AppSidebar } from "@/components/sidebar/sidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";

export const RootLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="min-h-screen bg-slate-50 font-sans text-slate-900">
				<SidebarTrigger />
				<Outlet />
			</main>
		</SidebarProvider>
	);
};
