import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { QueryProvider } from "@/providers/query-provider.tsx";

export const Providers = ({ children }: { children: React.ReactNode }) => (
	<QueryProvider>
		<TooltipProvider>{children}</TooltipProvider>
	</QueryProvider>
);
