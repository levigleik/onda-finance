import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth-store";

// 1. Definindo o schema de validação com Zod
const loginSchema = z.object({
	email: z.email("E-mail inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Inferindo a tipagem do TypeScript a partir do schema
type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginPage() {
	const navigate = useNavigate();

	// 2. Pegando apenas a função de login da store (boa prática de performance)
	const login = useAuthStore((state) => state.login);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
	});

	// 3. Função disparada no submit do form
	const onSubmit = async (data: LoginFormInputs) => {
		// Simulando um delay de API para o mock ficar mais real
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Chamando a action do Zustand para atualizar o estado global e persistir
		login({ name: "Usuário Teste", email: data.email });

		// Redirecionando o usuário para o Dashboard (que agora passará pelo loader)
		navigate("/");
	};

	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold text-slate-900">Onda Finance</h1>
				<p className="text-sm text-slate-500">Acesse sua conta</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">
						E-mail
					</label>
					<input
						{...register("email")}
						type="email"
						placeholder="seu@email.com"
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					{errors.email && (
						<p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
					)}
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium text-slate-700">
						Senha
					</label>
					<input
						{...register("password")}
						type="password"
						placeholder="••••••"
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					{errors.password && (
						<p className="mt-1 text-xs text-red-500">
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
				>
					{isSubmitting ? "Entrando..." : "Entrar"}
				</button>
			</form>
		</div>
	);
}
