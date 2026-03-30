import { useTranslation } from "react-i18next";
import { LoginForm } from "@/pages/login/components/login-form.tsx";

export function LoginPage() {
	const { t } = useTranslation(["app", "auth"]);

	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold">{t("name", { ns: "app" })}</h1>
				<p className="text-sm text-foreground">{t("title", { ns: "auth" })}</p>
			</div>
			<LoginForm />
		</div>
	);
}
