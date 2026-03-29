import { ArrowLeftRight, ChartBar, DollarSign, User2 } from "lucide-react";
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
import { cn } from "@/lib/utils.ts";

export const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader className="p-4">
				<SidebarMenu className="flex flex-col gap-1 mb-3 px-2">
					<SidebarMenuItem>
						<Link
							to="/"
							className="font-manrope font-black text-xl text-slate-900"
						>
							Onda Finance
						</Link>
					</SidebarMenuItem>
					<SidebarMenuItem className="text-xs font-medium text-slate-500 tracking-wider uppercase">
						Private Banking
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<Button
							asChild
							variant="ghost"
							className={cn(
								"w-full justify-start gap-3 px-3 py-2 rounded-lg font-manrope font-semibold text-sm",
								"bg-white text-slate-900 transition-all duration-200 ease-in-out hover:bg-white",
							)}
						>
							<Link to="/dashboard">
								<ChartBar className="h-5 w-5 shrink-0" />
								<span>Dashboard</span>
							</Link>
						</Button>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<Button
							asChild
							variant="ghost"
							className={cn(
								"w-full justify-start gap-3 px-3 py-2 rounded-lg font-manrope font-semibold text-sm",
								"bg-white text-slate-900 transition-all duration-200 ease-in-out hover:bg-white",
							)}
						>
							<Link to="/transactions">
								<DollarSign className="h-5 w-5 shrink-0" />
								<span>Transactions</span>
							</Link>
						</Button>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							// className={cn(
							// 	"w-full justify-start gap-3 px-3 py-2 rounded-lg font-manrope font-semibold text-sm",
							// 	"bg-white text-slate-900 transition-all duration-200 ease-in-out hover:bg-white",
							// )}
						>
							<Link to="/transactions">
								<ArrowLeftRight className="h-5 w-5 shrink-0" />
								<span>Transfers</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<User2 /> Username
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
