import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from "@/i18n";
import { renderAppRouter, seedAuthenticatedSession } from "@/test/render-utils";
import { useTransfersStore } from "@/stores/transfers-store";

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
				name: i18n.t("transactionsPage.title"),
			}),
		).toBeInTheDocument();

		await user.click(
			screen.getByRole("button", {
				name: i18n.t("language.openMenu"),
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
