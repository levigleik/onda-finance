import {
	ArrowLeftRight,
	ChartBar,
	DollarSign,
	Plus,
	Waves,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
				<SidebarMenu className="mb-3 flex flex-col gap-1 px-2 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:px-0">
					<SidebarMenuItem>
						<Link
							to="/"
							className="flex items-center gap-2 font-manrope text-xl font-black group-data-[collapsible=icon]:justify-center"
						>
							<Waves className="shrink-0" />
							<span className="group-data-[collapsible=icon]:hidden">
								Onda Finance
							</span>
						</Link>
					</SidebarMenuItem>

					<SidebarMenuItem className="text-xs font-medium uppercase tracking-wider text-foreground group-data-[collapsible=icon]:hidden">
						Private Banking
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="p-4 group-data-[collapsible=icon]:p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild isActive>
							<Link to="/dashboard">
								<ChartBar className="h-5 w-5 shrink-0" />
								<span>Dashboard</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to="/transactions">
								<DollarSign className="h-5 w-5 shrink-0" />
								<span>Transactions</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to="/transfers">
								<ArrowLeftRight className="h-5 w-5 shrink-0" />
								<span>Transfers</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<Button asChild className="w-full text-lg">
							<Link to="/transfers" className="flex justify-center p-6">
								<Plus className="h-5 w-5 shrink-0" />
								<span>New transfer</span>
							</Link>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
