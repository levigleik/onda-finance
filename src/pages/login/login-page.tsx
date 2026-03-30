import { useTranslation } from "react-i18next";
import { LoginForm } from "@/pages/login/components/login-form.tsx";

export function LoginPage() {
	const { t } = useTranslation();

	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold">{t("app.name")}</h1>
				<p className="text-sm text-foreground">{t("auth.title")}</p>
			</div>
			<LoginForm />
		</div>
	);
}
