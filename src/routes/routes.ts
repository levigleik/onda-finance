import {
	createBrowserRouter,
	type LoaderFunctionArgs,
	redirect,
} from "react-router";
import { AuthLayout } from "@/components/layout/auth-layout.tsx";
import { RootLayout } from "@/components/layout/root-layout.tsx";
import {
	buildLocalizedPath,
	DEFAULT_ROUTE_LANGUAGE,
	LANGUAGE_ROUTE_ID,
	replaceLeadingSegmentWithLanguage,
} from "@/i18n/config";
import { DashboardPage } from "@/pages/dashboard/dashboard-page.tsx";
import { LoginPage } from "@/pages/login/login-page.tsx";
import { TransactionsPage } from "@/pages/transactions/transactions-page.tsx";
import { AppErrorBoundary } from "@/routes/app-error-boundary";
import { requireAuthLoader, requireGuestLoader } from "@/routes/guards.ts";
import { LanguageLayout, languageLoader } from "@/routes/language";
import type { AppRouteHandle } from "@/routes/route-metadata";

const redirectWithPathname = (
	pathname: string,
	{ request }: LoaderFunctionArgs,
) => {
	const url = new URL(request.url);

	return redirect(`${pathname}${url.search}`);
};

const redirectToDefaultLanguage = (args: LoaderFunctionArgs) =>
	redirectWithPathname(buildLocalizedPath(DEFAULT_ROUTE_LANGUAGE), args);

const createLegacyRedirectLoader = (path: string) => (args: LoaderFunctionArgs) =>
	redirectWithPathname(buildLocalizedPath(DEFAULT_ROUTE_LANGUAGE, path), args);

export const appRoutes = [
	{
		path: "/",
		loader: redirectToDefaultLanguage,
	},
	{
		path: "/login",
		loader: createLegacyRedirectLoader("/login"),
	},
	{
		path: "/transactions",
		loader: createLegacyRedirectLoader("/transactions"),
	},
	{
		id: LANGUAGE_ROUTE_ID,
		path: "/:lang",
		ErrorBoundary: AppErrorBoundary,
		loader: languageLoader,
		Component: LanguageLayout,
		children: [
			{
				Component: RootLayout,
				loader: requireAuthLoader,
				children: [
					{
						index: true,
						Component: DashboardPage,
						handle: {
							meta: {
								namespace: "dashboard",
								titleKey: "seo.title",
								descriptionKey: "seo.description",
							},
						} satisfies AppRouteHandle,
					},
					{
						path: "transactions",
						Component: TransactionsPage,
						handle: {
							meta: {
								namespace: "transactionsPage",
								titleKey: "seo.title",
								descriptionKey: "seo.description",
							},
						} satisfies AppRouteHandle,
					},
				],
			},
			{
				path: "",
				Component: AuthLayout,
				loader: requireGuestLoader,
				children: [
					{
						path: "login",
						Component: LoginPage,
						handle: {
							meta: {
								namespace: "auth",
								titleKey: "seo.title",
								descriptionKey: "seo.description",
							},
						} satisfies AppRouteHandle,
					},
				],
			},
		],
	},
	{
		path: "*",
		loader: ({ request }: LoaderFunctionArgs) => {
			const url = new URL(request.url);

			return redirect(
				`${replaceLeadingSegmentWithLanguage(
					url.pathname,
					DEFAULT_ROUTE_LANGUAGE,
				)}${url.search}`,
			);
		},
	},
];

export const router = createBrowserRouter(appRoutes);
