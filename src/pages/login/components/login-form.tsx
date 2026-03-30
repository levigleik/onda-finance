import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { FormFieldText } from "@/components/form/form-field-text";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

const loginSchema = z.object({
	email: z.email("E-mail inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);

	const form = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormInputs) => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		login({ name: "Usuário Teste", email: data.email });
		navigate("/");
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="space-y-4"
			noValidate
		>
			<FormFieldText
				control={form.control}
				name="email"
				label="E-mail"
				type="email"
				placeholder="seu@email.com"
				autoComplete="email"
			/>

			<FormFieldText
				control={form.control}
				name="password"
				label="Senha"
				type="password"
				placeholder="••••••"
				autoComplete="current-password"
			/>

			<Button
				type="submit"
				disabled={form.formState.isSubmitting}
				className="w-full"
			>
				{form.formState.isSubmitting ? "Entrando..." : "Entrar"}
			</Button>
		</form>
	);
}
