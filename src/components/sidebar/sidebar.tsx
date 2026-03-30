import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { Brand } from "@/components/brand/brand";
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
					"h-16 px-4 transition-[padding] duration-200",
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
							className="flex items-center group-data-[collapsible=icon]:justify-center"
						>
							<Brand
								showWordmark={!isCollapsed}
								showTagline={false}
								iconContainerClassName="size-9 rounded-xl"
								nameClassName="text-xl"
							/>
						</Link>
					</SidebarMenuItem>

					{!isCollapsed ? (
						<SidebarMenuItem className="overflow-hidden">
							<span className="block whitespace-nowrap text-xs font-medium uppercase tracking-wider text-foreground transition-[opacity,transform,max-height] duration-200 ease-out">
								{t("tagline", { ns: "app" })}
							</span>
						</SidebarMenuItem>
					) : null}
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
						<SidebarMenuButton
							type="button"
							size="lg"
							tooltip={t("newTransfer", { ns: "nav" })}
							aria-label={t("newTransfer", { ns: "nav" })}
							className="h-10 bg-primary text-primary-foreground shadow-sm transition-[background-color,color,box-shadow] duration-200 hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 data-active:bg-primary data-active:text-primary-foreground group-data-[collapsible=icon]:justify-center"
							onClick={() => openTransferModal()}
						>
							<Plus className="h-5 w-5 shrink-0" />
							{!isCollapsed ? <span>{t("newTransfer", { ns: "nav" })}</span> : null}
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
