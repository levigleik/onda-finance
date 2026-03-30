import { AlertTriangle, Home } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";

const getErrorMessage = (error: unknown) => {
	if (isRouteErrorResponse(error)) {
		const routeMessage =
			typeof error.data === "string"
				? error.data
				: error.statusText || "Algo saiu do esperado.";

		return `${error.status} - ${routeMessage}`;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Não foi possível carregar a aplicação corretamente.";
};

export const AppErrorBoundary = () => {
	const error = useRouteError();
	const errorMessage = getErrorMessage(error);

	const handleGoHomeWithReload = () => {
		window.location.assign("/");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
			<div className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
					<AlertTriangle className="h-6 w-6" />
				</div>

				<div className="mt-6 space-y-3">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
						Erro inesperado
					</p>
					<h1 className="text-2xl font-semibold tracking-tight text-foreground">
						Algo deu errado ao carregar esta página.
					</h1>
					<p className="text-sm leading-6 text-muted-foreground">
						Vamos voltar para a página inicial e recarregar a aplicação para
						tentar recuperar o estado.
					</p>
				</div>

				<div className="mt-6 rounded-lg border bg-muted/20 px-4 py-3 text-left">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						Detalhes
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
					Ir para o início e recarregar
				</Button>
			</div>
		</div>
	);
};
