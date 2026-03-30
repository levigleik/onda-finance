import {
	ArrowUpRight,
	CalendarClock,
	SendHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/i18n/format";
import { useAppLanguage } from "@/i18n/use-app-language";
import { cn } from "@/lib/utils";
import { useTransferModalStore } from "@/stores/transfer-modal-store";
import type { TransferRecord } from "@/stores/transfers-store";

const isSameDay = (left: Date, right: Date) =>
	left.getFullYear() === right.getFullYear() &&
	left.getMonth() === right.getMonth() &&
	left.getDate() === right.getDate();

const formatTransferDate = (
	language: Parameters<typeof formatDate>[0],
	t: (key: string, options?: Record<string, unknown>) => string,
	transferDate: string,
	createdAt: string,
	status: TransferRecord["status"],
) => {
	const date = new Date(`${transferDate}T00:00:00`);
	const createdAtDate = new Date(createdAt);
	const today = new Date();
	const shortDate = formatDate(language, date, {
		day: "2-digit",
		month: "short",
	});
	const time = formatDate(language, createdAtDate, {
		hour: "2-digit",
		minute: "2-digit",
	});

	if (status === "scheduled") {
		return t("transfers.table.scheduledFor", { date: shortDate });
	}

	if (isSameDay(date, today)) {
		return t("transfers.table.todayAt", { time });
	}

	return `${shortDate}, ${time}`;
};

interface TransfersTableSectionProps {
	title: string;
	transfers: TransferRecord[];
	emptyTitle: string;
	emptyDescription: string;
	headerAction?: ReactNode;
}

export const TransfersTableSection = ({
	title,
	transfers,
	emptyTitle,
	emptyDescription,
	headerAction,
}: TransfersTableSectionProps) => {
	const { t } = useTranslation();
	const { i18nLanguage } = useAppLanguage();
	const openTransferModal = useTransferModalStore(
		(state) => state.openTransferModal,
	);

	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-xl font-bold text-foreground">{title}</h2>
				{headerAction ?? null}
			</div>

			<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="bg-muted/55">
								<th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
									{t("transfers.table.details")}
								</th>
								<th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
									{t("transfers.table.category")}
								</th>
								<th className="px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
									{t("transfers.table.date")}
								</th>
								<th className="px-8 py-4 text-right text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
									{t("transfers.table.amount")}
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-border/70">
							{transfers.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-8 py-16">
										<div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
											<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
												<SendHorizontal className="h-6 w-6" />
											</div>
											<div className="space-y-2">
												<p className="text-base font-semibold text-foreground">
													{emptyTitle}
												</p>
												<p className="text-sm text-muted-foreground">
													{emptyDescription}
												</p>
											</div>
											<Button type="button" onClick={openTransferModal}>
												{t("transfers.create")}
											</Button>
										</div>
									</td>
								</tr>
							) : (
								transfers.map((transfer) => (
									<tr
										key={transfer.id}
										className="transition-colors hover:bg-muted/20"
									>
										<td className="px-8 py-5">
											<div className="flex items-center gap-4">
												<div
												className={cn(
													"flex h-10 w-10 items-center justify-center rounded-full",
													transfer.status === "scheduled"
														? "bg-amber-500/10 text-amber-700"
														: "bg-slate-100 text-slate-600",
												)}
											>
													{transfer.status === "scheduled" ? (
														<CalendarClock className="h-4 w-4" />
													) : (
														<ArrowUpRight className="h-4 w-4" />
													)}
												</div>
												<div>
													<p className="text-sm font-bold text-foreground">
														{transfer.recipient.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{transfer.description || transfer.recipient.email}
													</p>
												</div>
											</div>
										</td>

										<td className="px-8 py-5">
											<span
												className={cn(
													"rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
													transfer.status === "scheduled"
														? "bg-amber-500/10 text-amber-700"
														: "bg-primary/10 text-primary",
												)}
											>
												{transfer.status === "scheduled"
													? t("transfers.table.scheduled")
													: t("transfers.table.completed")}
											</span>
										</td>

										<td className="px-8 py-5 text-sm font-medium text-muted-foreground">
											{formatTransferDate(
												i18nLanguage,
												t,
												transfer.transferDate,
												transfer.createdAt,
												transfer.status,
											)}
										</td>

										<td className="px-8 py-5 text-right">
											<span className="text-sm font-bold text-foreground">
												- {formatCurrency(i18nLanguage, transfer.amount)}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
};
