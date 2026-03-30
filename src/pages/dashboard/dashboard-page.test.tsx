import { screen, within } from "@testing-library/react";
import i18n from "@/i18n";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { TransferDialog } from "@/pages/transfers/components/transfer-dialog";
import type { TransferRecord } from "@/stores/transfers-store";
import {
	createUser,
} from "@/test/transfer-test-helpers";
import {
	renderWithProviders,
	seedAuthenticatedSession,
	seedTransfers,
} from "@/test/render-utils";

const tDashboard = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "dashboard", ...options });
const tTransfers = (key: string, options?: Record<string, unknown>) =>
	i18n.t(key, { ns: "transfers", ...options });

const DASHBOARD_CONTACT_TRANSFERS: TransferRecord[] = [
	{
		id: "contact-transfer-1",
		sender: {
			name: "Usuário Teste",
			email: "user@onda.com",
		},
		recipient: {
			name: "Marina Costa",
			email: "marina@onda.com",
			document: "529.982.247-25",
		},
		amount: 450,
		transferDate: "2026-03-27",
		description: "repasse semanal",
		status: "completed",
		createdAt: "2026-03-27T09:30:00-03:00",
	},
	{
		id: "contact-transfer-2",
		sender: {
			name: "Usuário Teste",
			email: "user@onda.com",
		},
		recipient: {
			name: "Bruno Martins",
			email: "bruno@onda.com",
			document: "123.456.789-09",
		},
		amount: 220,
		transferDate: "2026-03-28",
		description: "pagamento de apoio",
		status: "completed",
		createdAt: "2026-03-28T14:45:00-03:00",
	},
	{
		id: "contact-transfer-3",
		sender: {
			name: "Usuário Teste",
			email: "user@onda.com",
		},
		recipient: {
			name: "Marina Costa",
			email: "marina@onda.com",
			document: "529.982.247-25",
		},
		amount: 870,
		transferDate: "2026-03-30",
		description: "segunda parcela",
		status: "completed",
		createdAt: "2026-03-30T10:15:00-03:00",
	},
];

describe("DashboardPage", () => {
	it("deriva os contatos frequentes do histórico real e abre a transferência com prefill", async () => {
		const user = createUser();

		seedAuthenticatedSession();
		seedTransfers(DASHBOARD_CONTACT_TRANSFERS);

		renderWithProviders(
			<>
				<DashboardPage />
				<TransferDialog />
			</>,
		);

		const contactsSection = screen
			.getByRole("heading", {
				name: tDashboard("frequentContacts"),
			})
			.closest("section");

		expect(contactsSection).not.toBeNull();

		const contactsScope = within(contactsSection as HTMLElement);
		const transferButtons = contactsScope.getAllByRole("button");

		expect(transferButtons[0]).toHaveAccessibleName(
			tDashboard("transferTo", {
				name: "Marina Costa",
			}),
		);

		await user.click(
			contactsScope.getByRole("button", {
				name: tDashboard("transferTo", {
					name: "Marina Costa",
				}),
			}),
		);

		const dialog = await screen.findByRole("dialog");
		const dialogScope = within(dialog);

		expect(
			dialogScope.getByRole("heading", {
				name: tTransfers("step2.title"),
			}),
		).toBeInTheDocument();
		expect(dialogScope.getByText("Marina Costa")).toBeInTheDocument();
		expect(dialogScope.getByText("marina@onda.com")).toBeInTheDocument();

		await user.click(
			dialogScope.getByRole("button", {
				name: tTransfers("step2.back"),
			}),
		);

		expect(
			await dialogScope.findByRole("heading", {
				name: tTransfers("step1.title"),
			}),
		).toBeInTheDocument();

		const recipientNameInput = dialogScope.getByLabelText(
			tTransfers("step1.recipientName"),
		);
		const recipientEmailInput = dialogScope.getByLabelText(
			tTransfers("step1.recipientEmail"),
		);
		const recipientDocumentInput = dialogScope.getByLabelText(
			tTransfers("step1.recipientDocument"),
		);

		expect(recipientNameInput).toHaveValue("Marina Costa");
		expect(recipientEmailInput).toHaveValue("marina@onda.com");
		expect(recipientDocumentInput).toHaveValue("529.982.247-25");

		await user.clear(recipientNameInput);
		await user.type(recipientNameInput, "Marina Costa Editada");

		expect(recipientNameInput).toHaveValue("Marina Costa Editada");
	});
});
