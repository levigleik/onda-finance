import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { QueryProvider } from "@/providers/query-provider.tsx";
import { ThemeProvider } from "@/providers/theme-provider.tsx";

export const Providers = ({ children }: { children: React.ReactNode }) => (
	<QueryProvider>
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<TooltipProvider>
				<Toaster />
				{children}
			</TooltipProvider>
		</ThemeProvider>
	</QueryProvider>
);
