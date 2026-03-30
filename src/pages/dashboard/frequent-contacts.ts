import type {
	TransferParticipant,
	TransferRecord,
} from "@/stores/transfers-store";

export interface FrequentContact {
	key: string;
	recipient: TransferParticipant;
	transferCount: number;
	lastTransferAt: string;
}

const normalizeRecipientKey = (recipient: TransferParticipant) => {
	const normalizedEmail = recipient.email.trim().toLowerCase();
	const normalizedDocument = recipient.document?.replace(/\D/g, "") ?? "";
	const normalizedName = recipient.name.trim().toLowerCase();

	if (normalizedDocument) {
		return `${normalizedEmail}:${normalizedDocument}`;
	}

	return normalizedEmail || normalizedName;
};

export const getFrequentContacts = (
	transfers: TransferRecord[],
	limit = 3,
): FrequentContact[] => {
	const contactsByRecipient = new Map<string, FrequentContact>();

	for (const transfer of transfers) {
		const key = normalizeRecipientKey(transfer.recipient);
		const existingContact = contactsByRecipient.get(key);

		if (!existingContact) {
			contactsByRecipient.set(key, {
				key,
				recipient: { ...transfer.recipient },
				transferCount: 1,
				lastTransferAt: transfer.createdAt,
			});
			continue;
		}

		const currentTransferTimestamp = new Date(transfer.createdAt).getTime();
		const lastTransferTimestamp = new Date(existingContact.lastTransferAt).getTime();

		existingContact.transferCount += 1;

		if (currentTransferTimestamp > lastTransferTimestamp) {
			existingContact.recipient = { ...transfer.recipient };
			existingContact.lastTransferAt = transfer.createdAt;
		}
	}

	return [...contactsByRecipient.values()]
		.sort((left, right) => {
			if (right.transferCount !== left.transferCount) {
				return right.transferCount - left.transferCount;
			}

			const leftTimestamp = new Date(left.lastTransferAt).getTime();
			const rightTimestamp = new Date(right.lastTransferAt).getTime();

			if (rightTimestamp !== leftTimestamp) {
				return rightTimestamp - leftTimestamp;
			}

			return left.recipient.name.localeCompare(right.recipient.name);
		})
		.slice(0, limit);
};
