import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TransfersTableSection } from "@/pages/dashboard/components/transfers-table-section";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useTransferModalStore } from "@/stores/transfer-modal-store";
import { useTransfersStore } from "@/stores/transfers-store";

const PAGE_SIZE = 10;

const getVisiblePages = (currentPage: number, totalPages: number) => {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const pages = new Set([
		1,
		totalPages,
		currentPage - 1,
		currentPage,
		currentPage + 1,
	]);
	const sortedPages = [...pages]
		.filter((page) => page >= 1 && page <= totalPages)
		.sort((left, right) => left - right);

	const visiblePages: Array<number | "ellipsis"> = [];

	for (const page of sortedPages) {
		const previousPage = visiblePages.at(-1);

		if (typeof previousPage === "number") {
			const gap = page - previousPage;

			if (gap === 2) {
				visiblePages.push(previousPage + 1);
			} else if (gap > 2) {
				visiblePages.push("ellipsis");
			}
		}

		visiblePages.push(page);
	}

	return visiblePages;
};

export const TransactionsPage = () => {
	const { t } = useTranslation();
	const [currentPage, setCurrentPage] = useState(1);
	const openTransferModal = useTransferModalStore(
		(state) => state.openTransferModal,
	);
	const transfers = useTransfersStore((state) => state.transfers);
	const totalPages = Math.max(1, Math.ceil(transfers.length / PAGE_SIZE));

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const paginatedTransfers = useMemo(() => {
		const startIndex = (currentPage - 1) * PAGE_SIZE;

		return transfers.slice(startIndex, startIndex + PAGE_SIZE);
	}, [currentPage, transfers]);

	const visiblePages = useMemo(
		() => getVisiblePages(currentPage, totalPages),
		[currentPage, totalPages],
	);

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
			<TransfersTableSection
				title={t("transactionsPage.title")}
				transfers={paginatedTransfers}
				emptyTitle={t("transactionsPage.emptyTitle")}
				emptyDescription={t("transactionsPage.emptyDescription")}
				headerAction={
					<Button type="button" variant="ghost" onClick={openTransferModal}>
						{t("transactionsPage.newTransfer")}
					</Button>
				}
			/>

			{totalPages > 1 ? (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								aria-disabled={currentPage === 1}
								className={
									currentPage === 1 ? "pointer-events-none opacity-50" : ""
								}
								onClick={(event) => {
									event.preventDefault();

									if (currentPage > 1) {
										setCurrentPage((page) => page - 1);
									}
								}}
							/>
						</PaginationItem>

						{visiblePages.map((page, index) => (
							<PaginationItem key={`${page}-${index}`}>
								{page === "ellipsis" ? (
									<PaginationEllipsis />
								) : (
									<PaginationLink
										href="#"
										isActive={page === currentPage}
										onClick={(event) => {
											event.preventDefault();
											setCurrentPage(page);
										}}
									>
										{page}
									</PaginationLink>
								)}
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								href="#"
								aria-disabled={currentPage === totalPages}
								className={
									currentPage === totalPages
										? "pointer-events-none opacity-50"
										: ""
								}
								onClick={(event) => {
									event.preventDefault();

									if (currentPage < totalPages) {
										setCurrentPage((page) => page + 1);
									}
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			) : null}
		</div>
	);
};
