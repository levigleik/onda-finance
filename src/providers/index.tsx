import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import i18n from "@/i18n";
import { QueryProvider } from "@/providers/query-provider.tsx";
import { ThemeProvider } from "@/providers/theme-provider.tsx";

export const Providers = ({ children }: { children: React.ReactNode }) => (
	<QueryProvider>
		<I18nextProvider i18n={i18n}>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<TooltipProvider>
					<Toaster />
					{children}
				</TooltipProvider>
			</ThemeProvider>
		</I18nextProvider>
	</QueryProvider>
);
