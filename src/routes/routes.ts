import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/components/layout/auth-layout.tsx";
import { RootLayout } from "@/components/layout/root-layout.tsx";
import { DashboardPage } from "@/pages/dashboard/dashboard-page.tsx";
import { LoginPage } from "@/pages/login/login-page.tsx";
import { TransactionsPage } from "@/pages/transactions/transactions-page.tsx";
import { AppErrorBoundary } from "@/routes/app-error-boundary";
import { requireAuthLoader, requireGuestLoader } from "@/routes/guards.ts";

export const router = createBrowserRouter([
	{
		path: "/",
		ErrorBoundary: AppErrorBoundary,
		children: [
			{
				Component: RootLayout,
				loader: requireAuthLoader,
				children: [
					{ index: true, Component: DashboardPage },
					{ path: "transactions", Component: TransactionsPage },
				],
			},
			{
				path: "",
				Component: AuthLayout,
				loader: requireGuestLoader,
				children: [{ path: "login", Component: LoginPage }],
			},
		],
	},
]);
