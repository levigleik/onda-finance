import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FormTransfers } from "@/pages/transfers/form/form-transfers";
import { useTransferModalStore } from "@/stores/transfer-modal-store";

export const TransferDialog = () => {
	const { t } = useTranslation("transfers");
	const [isDismissLocked, setIsDismissLocked] = useState(false);
	const isOpen = useTransferModalStore((state) => state.isTransferModalOpen);
	const recipientPreset = useTransferModalStore(
		(state) => state.recipientPreset,
	);
	const initialStep = useTransferModalStore((state) => state.initialStep);
	const setTransferModalOpen = useTransferModalStore(
		(state) => state.setTransferModalOpen,
	);
	const closeTransferModal = useTransferModalStore(
		(state) => state.closeTransferModal,
	);
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setIsDismissLocked(false);
		}

		setTransferModalOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent
				className="grid h-[calc(100vh-2rem)] grid-rows-[auto,minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-7xl"
				onInteractOutside={(event) => {
					if (isDismissLocked) {
						event.preventDefault();
					}
				}}
			>
				<DialogHeader className="shrink-0 border-b px-5 py-4 md:px-6">
					<DialogTitle className="text-lg font-semibold">
						{t("dialog.title")}
					</DialogTitle>
					<DialogDescription>{t("dialog.description")}</DialogDescription>
				</DialogHeader>

				<div className="flex min-h-0 flex-col overflow-hidden px-4 py-5 md:px-6 md:py-6">
					<FormTransfers
						onSuccess={closeTransferModal}
						onDismissLockChange={setIsDismissLocked}
						recipientPreset={recipientPreset}
						initialStep={initialStep}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};
