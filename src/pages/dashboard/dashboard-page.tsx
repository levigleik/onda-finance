import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { TransfersTableSection } from "@/pages/dashboard/components/transfers-table-section";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useTransfersStore } from "@/stores/transfers-store";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const MONTHLY_YIELD = 2.4;

export const DashboardPage = () => {
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
								Saldo Atual
							</p>
							<h1 className="text-5xl font-extrabold tracking-tighter md:text-6xl">
								{currencyFormatter.format(balance)}
							</h1>
						</div>

						<div className="flex flex-wrap items-center gap-6">
							<div className="flex flex-col">
								<span className="text-xs font-medium text-primary-foreground/70">
									RENDIMENTO MENSAL
								</span>
								<span className="mt-1 flex items-center gap-1 font-bold text-emerald-200">
									<TrendingUp className="h-4 w-4" />+ {MONTHLY_YIELD.toFixed(1)}
									%
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
					<h2 className="mb-4 text-lg font-semibold">Contatos Frequentes</h2>

					<div className="space-y-4">
						<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
							<div>
								<p className="font-medium">Ana Souza</p>
								<p className="text-sm text-muted-foreground">
									ana.souza@email.com
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
							<div>
								<p className="font-medium">Carlos Lima</p>
								<p className="text-sm text-muted-foreground">
									carlos.lima@email.com
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<TransfersTableSection
				title="Últimas transferências"
				transfers={recentTransfers}
				emptyTitle="Nenhuma transferência recente"
				emptyDescription="Assim que você enviar uma transferência, ela aparece aqui entre os três registros mais recentes."
				headerAction={
					<Button asChild type="button" variant="ghost">
						<Link to="/transactions">Ver mais</Link>
					</Button>
				}
			/>
		</div>
	);
};
