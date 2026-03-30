import { screen } from "@testing-library/react";
import i18n from "@/i18n";
import { Brand } from "@/components/brand/brand";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { renderWithProviders, seedAuthenticatedSession } from "@/test/render-utils";

const tApp = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "app", ...options });
const tNav = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "nav", ...options });

describe("sidebar branding", () => {
	it("renderiza a marca compartilhada com nome e tagline quando expandida", () => {
		renderWithProviders(<Brand showTagline />);

		expect(screen.getByText(tApp("name"))).toBeInTheDocument();
		expect(screen.getByText(tApp("tagline"))).toBeInTheDocument();
	});

	it("sidebar colapsado mostra apenas o simbolo da marca e o CTA iconizado", () => {
		seedAuthenticatedSession();

		renderWithProviders(
			<SidebarProvider defaultOpen={false}>
				<AppSidebar />
			</SidebarProvider>,
		);

		expect(screen.queryByText(tApp("name"))).not.toBeInTheDocument();
		expect(screen.queryByText(tApp("tagline"))).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: tNav("newTransfer") })).toBeInTheDocument();
		expect(screen.queryByText(tNav("newTransfer"))).not.toBeInTheDocument();
	});
});
