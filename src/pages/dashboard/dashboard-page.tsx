import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FrequentContactsSection } from "@/pages/dashboard/components/frequent-contacts-section";
import { TransfersTableSection } from "@/pages/dashboard/components/transfers-table-section";
import { Button } from "@/components/ui/button";
import { buildLocalizedPath } from "@/i18n/config";
import { formatCurrency, formatNumber } from "@/i18n/format";
import { useAppLanguage } from "@/i18n/use-app-language";
import { useAuthStore } from "@/stores/auth-store";
import { useTransfersStore } from "@/stores/transfers-store";

const MONTHLY_YIELD = 2.4;

export const DashboardPage = () => {
	const { t } = useTranslation("dashboard");
	const { i18nLanguage, routeLanguage } = useAppLanguage();
	const balance = useAuthStore((state) => state.balance);
	const transfers = useTransfersStore((state) => state.transfers);
	const recentTransfers = useMemo(() => transfers.slice(0, 3), [transfers]);

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-stretch">
				<div className="flex-1 relative overflow-hidden rounded-xl bg-linear-to-br from-primary via-primary to-primary/85 p-8 text-primary-foreground shadow-lg lg:col-span-3">
					<div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

					<div className="relative z-10 flex h-full flex-col justify-between gap-8">
						<div>
							<p className="mb-2 text-sm font-medium uppercase tracking-[0.22em] text-primary-foreground/70">
								{t("currentBalance")}
							</p>
							<h1 className="text-5xl font-extrabold tracking-tighter md:text-6xl">
								{formatCurrency(i18nLanguage, balance)}
							</h1>
						</div>

						<div className="flex flex-wrap items-center gap-6">
							<div className="flex flex-col">
								<span className="text-xs font-medium text-primary-foreground/70">
									{t("monthlyYield")}
								</span>
								<span className="mt-1 flex items-center gap-1 font-bold text-emerald-200">
									<TrendingUp className="h-4 w-4" />+{" "}
									{formatNumber(i18nLanguage, MONTHLY_YIELD, {
										minimumFractionDigits: 1,
										maximumFractionDigits: 1,
									})}
									%
								</span>
							</div>
						</div>
					</div>
				</div>
				<FrequentContactsSection transfers={transfers} />
			</section>

			<TransfersTableSection
				title={t("latestTransfers")}
				transfers={recentTransfers}
				emptyTitle={t("emptyTitle")}
				emptyDescription={t("emptyDescription")}
				headerAction={
					<Button asChild type="button" variant="ghost">
						<Link to={buildLocalizedPath(routeLanguage, "/transactions")}>
							{t("viewMore")}
						</Link>
					</Button>
				}
			/>
		</div>
	);
};
