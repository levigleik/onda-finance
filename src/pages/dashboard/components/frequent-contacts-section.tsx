import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { getFrequentContacts } from "@/pages/dashboard/frequent-contacts";
import { useTransferModalStore } from "@/stores/transfer-modal-store";
import type { TransferRecord } from "@/stores/transfers-store";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface FrequentContactsSectionProps {
	transfers: TransferRecord[];
}

export const FrequentContactsSection = ({
	transfers,
}: FrequentContactsSectionProps) => {
	const { t } = useTranslation("dashboard");
	const openTransferModal = useTransferModalStore(
		(state) => state.openTransferModal,
	);
	const frequentContacts = useMemo(
		() => getFrequentContacts(transfers, 2),
		[transfers],
	);

	return (
		<section className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
			<div className="mb-5 space-y-1.5">
				<h2 className="text-lg font-semibold">{t("frequentContacts")}</h2>
			</div>

			{frequentContacts.length === 0 ? (
				<div className="rounded-2xl border border-dashed bg-muted/25 px-4 py-6 text-center">
					<p className="text-sm font-semibold text-foreground">
						{t("emptyContactsTitle")}
					</p>
					<p className="mt-2 text-sm text-muted-foreground">
						{t("emptyContactsDescription")}
					</p>
				</div>
			) : (
				<ul className="space-y-3">
					{frequentContacts.map((contact) => (
						<li
							key={contact.key}
							className="rounded-2xl border bg-muted/30 p-4 transition-colors duration-200 hover:bg-muted/45"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex min-w-0 items-start gap-3">
									<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
										{getInitials(contact.recipient.name)}
									</div>

									<div className="min-w-0">
										<h3 className="truncate text-sm font-semibold text-foreground">
											{contact.recipient.name}
										</h3>
										<p className="truncate text-sm text-muted-foreground">
											{contact.recipient.email}
										</p>
									</div>
								</div>

								<Button
									type="button"
									variant="outline"
									className="shrink-0"
									aria-label={t("transferTo", {
										name: contact.recipient.name,
									})}
									onClick={() =>
										openTransferModal({
											initialStep: 2,
											recipientPreset: {
												name: contact.recipient.name,
												email: contact.recipient.email,
												document: contact.recipient.document,
											},
										})
									}
								>
									{t("transferAction")}
									<ArrowUpRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
};
