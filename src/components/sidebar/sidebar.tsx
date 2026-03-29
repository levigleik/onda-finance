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
import { cn } from "@/lib/utils.ts";

export const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader
				className={cn(
					"h-16 overflow-hidden px-4 transition-[padding] duration-200",
					"group-data-[collapsible=icon]:justify-center",
					"group-data-[collapsible=icon]:px-2",
				)}
			>
				<SidebarMenu
					className={cn(
						"mb-3 flex flex-col justify-center gap-1 px-2 transition-[margin,padding] duration-200",
						"group-data-[collapsible=icon]:mb-0",
						"group-data-[collapsible=icon]:px-0",
					)}
				>
					<SidebarMenuItem>
						<Link
							to="/"
							className={cn(
								"flex items-center gap-2 overflow-hidden",
								"font-manrope text-xl font-black",
							)}
						>
							<div className="flex size-8 shrink-0 items-center justify-center">
								<Waves className="shrink-0" />
							</div>

							<div className="min-w-0 overflow-hidden">
								<span
									className={cn(
										"block whitespace-nowrap",
										"transition-[opacity,transform,max-width] duration-200 ease-out",
										"opacity-100 translate-x-0 max-w-[220px]",
										"group-data-[collapsible=icon]:pointer-events-none",
										"group-data-[collapsible=icon]:opacity-0",
										"group-data-[collapsible=icon]:-translate-x-2",
										"group-data-[collapsible=icon]:max-w-0",
									)}
								>
									Onda Finance
								</span>
							</div>
						</Link>
					</SidebarMenuItem>

					<SidebarMenuItem className="overflow-hidden">
						<span
							className={cn(
								"block whitespace-nowrap text-xs font-medium uppercase tracking-wider text-foreground",
								"transition-[opacity,transform,max-height] duration-200 ease-out",
								"opacity-100 translate-y-0 max-h-6",
								"group-data-[collapsible=icon]:pointer-events-none",
								"group-data-[collapsible=icon]:opacity-0",
								"group-data-[collapsible=icon]:-translate-y-1",
								"group-data-[collapsible=icon]:max-h-0",
							)}
						>
							Private Banking
						</span>
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
