import { Plus, Waves } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	buildLocalizedPath,
	stripLanguageFromPath,
} from "@/i18n/config";
import { useAppLanguage } from "@/i18n/use-app-language";
import { cn } from "@/lib/utils.ts";
import { useTransferModalStore } from "@/stores/transfer-modal-store";

import { navItems } from "./nav-items";

export const AppSidebar = () => {
	const { t } = useTranslation(["app", "nav"]);
	const location = useLocation();
	const { routeLanguage } = useAppLanguage();
	const { isMobile, state } = useSidebar();
	const openTransferModal = useTransferModalStore(
		(state) => state.openTransferModal,
	);
	const currentPath = stripLanguageFromPath(location.pathname);
	const isCollapsed = state === "collapsed" && !isMobile;

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
							to={buildLocalizedPath(routeLanguage)}
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
									{t("name", { ns: "app" })}
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
							{t("tagline", { ns: "app" })}
						</span>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="p-4 transition-[padding] duration-200 group-data-[collapsible=icon]:p-2">
				<SidebarMenu>
					{navItems.map((item) => {
						const isActive =
							item.url === "/"
								? currentPath === "/"
								: currentPath.startsWith(item.url);

						return (
							<SidebarMenuItem key={item.titleKey}>
								<SidebarMenuButton
									asChild
									isActive={isActive}
									tooltip={t(item.titleKey, { ns: "nav" })}
								>
									<Link to={buildLocalizedPath(routeLanguage, item.url)}>
										<item.icon className="h-5 w-5 shrink-0" />
										<span>{t(item.titleKey, { ns: "nav" })}</span>
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
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									className={cn(
										"w-full justify-start gap-2 overflow-hidden rounded-lg text-sm font-semibold transition-[width,padding,gap] duration-200",
										"group-data-[collapsible=icon]:size-10",
										"group-data-[collapsible=icon]:justify-center",
										"group-data-[collapsible=icon]:px-0",
									)}
									aria-label={t("newTransfer", { ns: "nav" })}
									onClick={() => openTransferModal()}
								>
									<Plus className="h-5 w-5 shrink-0" />
									<span
										className={cn(
											"whitespace-nowrap transition-[opacity,transform,max-width] duration-200 ease-out",
											"max-w-40 opacity-100 translate-x-0",
											isCollapsed &&
												"pointer-events-none max-w-0 -translate-x-2 opacity-0",
										)}
									>
										{t("newTransfer", { ns: "nav" })}
									</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right" align="center" hidden={!isCollapsed}>
								{t("newTransfer", { ns: "nav" })}
							</TooltipContent>
						</Tooltip>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
