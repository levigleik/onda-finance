import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from "@/i18n";
import { renderAppRouter, seedAuthenticatedSession } from "@/test/render-utils";
import { useTransfersStore } from "@/stores/transfers-store";

const tApp = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "app", ...options });
const tAuth = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "auth", ...options });
const tDashboard = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "dashboard", ...options });
const tLanguage = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "language", ...options });
const tTransactionsPage = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "transactionsPage", ...options });

const getMetaContent = (selector: string) =>
	document.head.querySelector(selector)?.getAttribute("content");

describe("i18n routing", () => {
	it("redireciona a raiz para /pt-br", async () => {
		seedAuthenticatedSession();

		const { router } = renderAppRouter({
			initialEntries: ["/"],
		});

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/pt-br");
		});
	});

	it("sincroniza title e meta description do dashboard em /pt-br", async () => {
		seedAuthenticatedSession();

		renderAppRouter({
			initialEntries: ["/pt-br"],
		});

		await waitFor(() => {
			expect(document.title).toBe(`${tDashboard("seo.title")} | ${tApp("name")}`);
		});

		expect(getMetaContent('meta[name="description"]')).toBe(
			tDashboard("seo.description"),
		);
		expect(getMetaContent('meta[property="og:title"]')).toBe(
			`${tDashboard("seo.title")} | ${tApp("name")}`,
		);
		expect(getMetaContent('meta[property="og:description"]')).toBe(
			tDashboard("seo.description"),
		);
		expect(getMetaContent('meta[property="og:site_name"]')).toBe(
			tApp("seo.ogSiteName"),
		);
		expect(getMetaContent('meta[property="og:locale"]')).toBe("pt_BR");
	});

	it("redireciona idioma inválido para a rota equivalente em /pt-br", async () => {
		seedAuthenticatedSession();

		const { router } = renderAppRouter({
			initialEntries: ["/xx/transactions"],
		});

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/pt-br/transactions");
		});
	});

	it("troca o idioma pelo dropdown do navbar preservando a rota atual", async () => {
		seedAuthenticatedSession();
		const user = userEvent.setup();
		const { router } = renderAppRouter({
			initialEntries: ["/pt-br/transactions"],
		});

		expect(
			await screen.findByRole("heading", {
				name: tTransactionsPage("title"),
			}),
		).toBeInTheDocument();

		await user.click(
			screen.getByRole("button", {
				name: tLanguage("openMenu"),
			}),
		);
		await user.click(
			screen.getByRole("menuitemradio", {
				name: /English \(United States\)/i,
			}),
		);

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/en-us/transactions");
		});
		expect(
			await screen.findByRole("heading", {
				name: "All transfers",
			}),
		).toBeInTheDocument();
		expect(document.title).toBe(
			`${tTransactionsPage("seo.title")} | ${tApp("name")}`,
		);
		expect(getMetaContent('meta[name="description"]')).toBe(
			tTransactionsPage("seo.description"),
		);
		expect(getMetaContent('meta[property="og:locale"]')).toBe("en_US");
	});

	it("sincroniza title e metas da página de login em /pt-br/login", async () => {
		renderAppRouter({
			initialEntries: ["/pt-br/login"],
		});

		expect(
			await screen.findByRole("heading", {
				name: tAuth("title"),
			}),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(document.title).toBe(`${tAuth("seo.title")} | ${tApp("name")}`);
		});

		expect(getMetaContent('meta[name="description"]')).toBe(
			tAuth("seo.description"),
		);
		expect(getMetaContent('meta[property="og:title"]')).toBe(
			`${tAuth("seo.title")} | ${tApp("name")}`,
		);
	});

	it("migra status antigos persistidos para os novos códigos internos", async () => {
		useTransfersStore.setState(useTransfersStore.getInitialState(), true);
		localStorage.setItem(
			"onda-finance-transfers",
			JSON.stringify({
				state: {
					transfers: [
						{
							id: "legacy-scheduled",
							sender: { name: "Sender", email: "sender@example.com" },
							recipient: { name: "Recipient", email: "recipient@example.com" },
							amount: 100,
							transferDate: "2026-03-31",
							description: "",
							status: "agendada",
							createdAt: "2026-03-30T12:00:00.000Z",
						},
						{
							id: "legacy-completed",
							sender: { name: "Sender", email: "sender@example.com" },
							recipient: { name: "Recipient", email: "recipient@example.com" },
							amount: 50,
							transferDate: "2026-03-30",
							description: "",
							status: "concluida",
							createdAt: "2026-03-30T11:00:00.000Z",
						}
					]
				},
				version: 0
			}),
		);

		await useTransfersStore.persist.rehydrate();

		expect(useTransfersStore.getState().transfers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ status: "scheduled" }),
				expect.objectContaining({ status: "completed" }),
			]),
		);
	});
});
