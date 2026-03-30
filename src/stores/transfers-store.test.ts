import {
	DEFAULT_TRANSFER_SEED,
	useTransfersStore,
} from "@/stores/transfers-store";

describe("useTransfersStore", () => {
	it("inicia com o baseline mock de transferências", () => {
		expect(useTransfersStore.getState().transfers).toEqual(
			DEFAULT_TRANSFER_SEED,
		);
	});

	it("rehidrata dados antigos adicionando o baseline uma única vez", async () => {
		localStorage.setItem(
			"onda-finance-transfers",
			JSON.stringify({
				state: {
					transfers: [
						{
							id: "legacy-user-transfer",
							sender: {
								name: "Usuário Teste",
								email: "user@onda.com",
							},
							recipient: {
								name: "Fornecedor Externo",
								email: "financeiro@fornecedor.com",
								document: "111.222.333-44",
							},
							amount: 275,
							transferDate: "2026-03-29",
							description: "pagamento anterior",
							status: "concluida",
							createdAt: "2026-03-29T16:20:00-03:00",
						},
					],
				},
				version: 1,
			}),
		);

		await useTransfersStore.persist.rehydrate();

		const transfers = useTransfersStore.getState().transfers;
		const seedIds = new Set(DEFAULT_TRANSFER_SEED.map((transfer) => transfer.id));
		const injectedSeedTransfers = transfers.filter((transfer) =>
			seedIds.has(transfer.id),
		);

		expect(transfers).toHaveLength(DEFAULT_TRANSFER_SEED.length + 1);
		expect(transfers[0]).toEqual(
			expect.objectContaining({
				id: "legacy-user-transfer",
				status: "completed",
			}),
		);
		expect(injectedSeedTransfers).toHaveLength(DEFAULT_TRANSFER_SEED.length);
	});
});
