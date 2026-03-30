import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { z } from "zod";

import { FormFieldText } from "@/components/form/form-field-text";
import { Button } from "@/components/ui/button";
import { buildLocalizedPath } from "@/i18n/config";
import { useAppLanguage } from "@/i18n/use-app-language";
import { useAuthStore } from "@/stores/auth-store";

type LoginFormInputs = {
	email: string;
	password: string;
};

export function LoginForm() {
	const { t } = useTranslation("auth");
	const navigate = useNavigate();
	const { routeLanguage } = useAppLanguage();
	const login = useAuthStore((state) => state.login);
	const loginSchema = useMemo(
		() =>
			z.object({
				email: z.email(t("validation.invalidEmail")),
				password: z.string().min(6, t("validation.passwordMin")),
			}),
		[t],
	);

	const form = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormInputs) => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		login({ name: t("demoUserName"), email: data.email });
		navigate(buildLocalizedPath(routeLanguage));
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
				label={t("emailLabel")}
				type="email"
				placeholder={t("emailPlaceholder")}
				autoComplete="email"
			/>

			<FormFieldText
				control={form.control}
				name="password"
				label={t("passwordLabel")}
				type="password"
				placeholder={t("passwordPlaceholder")}
				autoComplete="current-password"
			/>

			<Button
				type="submit"
				disabled={form.formState.isSubmitting}
				className="w-full"
			>
				{form.formState.isSubmitting
					? t("submitting")
					: t("submit")}
			</Button>
		</form>
	);
}
