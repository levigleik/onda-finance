import { Plus, Waves } from "lucide-react";
import { Link, useLocation } from "react-router"; // Adicionado useLocation
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
import { useTransferModalStore } from "@/stores/transfer-modal-store";

import { navItems } from "./nav-items"; // Importando nossos itens

export const AppSidebar = () => {
	const location = useLocation();
	const openTransferModal = useTransferModalStore(
		(state) => state.openTransferModal,
	);

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
										"opacity-100 translate-x-0 max-w-55",
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
					{navItems.map((item) => {
						const isActive =
							item.url === "/"
								? location.pathname === "/"
								: location.pathname.startsWith(item.url);

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									isActive={isActive}
									tooltip={item.title}
								>
									<Link to={item.url}>
										<item.icon className="h-5 w-5 shrink-0" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<Button
							type="button"
							className="w-full text-lg"
							onClick={openTransferModal}
						>
							<Plus className="h-5 w-5 shrink-0" />
							<span>New transfer</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
