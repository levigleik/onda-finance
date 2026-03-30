import { AlertTriangle, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";
import { buildLocalizedPath } from "@/i18n/config";
import { useLanguageRouteData } from "@/routes/language";

const getErrorMessage = (
	error: unknown,
	{
		fallbackMessage,
		unexpectedMessage,
	}: { fallbackMessage: string; unexpectedMessage: string },
) => {
	if (isRouteErrorResponse(error)) {
		const routeMessage =
			typeof error.data === "string"
				? error.data
				: error.statusText || unexpectedMessage;

		return `${error.status} - ${routeMessage}`;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallbackMessage;
};

export const AppErrorBoundary = () => {
	const { t } = useTranslation();
	const { routeLanguage } = useLanguageRouteData();
	const error = useRouteError();
	const errorMessage = getErrorMessage(error, {
		fallbackMessage: t("errorBoundary.fallbackMessage"),
		unexpectedMessage: t("errorBoundary.unexpected"),
	});

	const handleGoHomeWithReload = () => {
		window.location.assign(buildLocalizedPath(routeLanguage));
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
			<div className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
					<AlertTriangle className="h-6 w-6" />
				</div>

				<div className="mt-6 space-y-3">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
						{t("errorBoundary.eyebrow")}
					</p>
					<h1 className="text-2xl font-semibold tracking-tight text-foreground">
						{t("errorBoundary.title")}
					</h1>
					<p className="text-sm leading-6 text-muted-foreground">
						{t("errorBoundary.description")}
					</p>
				</div>

				<div className="mt-6 rounded-lg border bg-muted/20 px-4 py-3 text-left">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						{t("errorBoundary.details")}
					</p>
					<p className="mt-2 break-words text-sm text-foreground">
						{errorMessage}
					</p>
				</div>

				<Button
					type="button"
					size="lg"
					className="mt-6 w-full sm:w-auto"
					onClick={handleGoHomeWithReload}
				>
					<Home className="mr-2 h-4 w-4" />
					{t("errorBoundary.goHome")}
				</Button>
			</div>
		</div>
	);
};
