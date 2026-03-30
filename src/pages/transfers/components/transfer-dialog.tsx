import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormTransfers } from "@/pages/transfers/form/form-transfers";
import { useTransferModalStore } from "@/stores/transfer-modal-store";

export const TransferDialog = () => {
	const isOpen = useTransferModalStore((state) => state.isTransferModalOpen);
	const setTransferModalOpen = useTransferModalStore(
		(state) => state.setTransferModalOpen,
	);
	const closeTransferModal = useTransferModalStore(
		(state) => state.closeTransferModal,
	);

	return (
		<Dialog open={isOpen} onOpenChange={setTransferModalOpen}>
			<DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden p-0 sm:max-w-7xl">
				<ScrollArea>
					<div className="overflow-y-auto">
						<DialogHeader className="border-b px-5 py-4 md:px-6">
							<DialogTitle className="text-lg font-semibold">
								Nova transferência
							</DialogTitle>
							<DialogDescription>
								Preencha os dados do destinatário, valor e data para concluir a
								transferência.
							</DialogDescription>
						</DialogHeader>

						<div className="px-4 py-5 md:px-6 md:py-6">
							<FormTransfers onSuccess={closeTransferModal} />
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
