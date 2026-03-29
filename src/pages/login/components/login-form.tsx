import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
			<Controller
				name="email"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
						<FieldContent>
							<Input
								{...field}
								id={field.name}
								type="email"
								placeholder="seu@email.com"
								aria-invalid={fieldState.invalid}
								autoComplete="email"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</FieldContent>
					</Field>
				)}
			/>

			<Controller
				name="password"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Senha</FieldLabel>
						<FieldContent>
							<Input
								{...field}
								id={field.name}
								type="password"
								placeholder="••••••"
								aria-invalid={fieldState.invalid}
								autoComplete="current-password"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</FieldContent>
					</Field>
				)}
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
