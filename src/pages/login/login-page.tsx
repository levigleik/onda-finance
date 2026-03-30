import { LoginForm } from "@/pages/login/components/login-form.tsx";

export function LoginPage() {
	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold">Onda Finance</h1>
				<p className="text-sm text-foreground">Acesse sua conta</p>
			</div>
			<LoginForm />
		</div>
	);
}
