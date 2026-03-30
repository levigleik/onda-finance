import { useTranslation } from "react-i18next";
import { Brand } from "@/components/brand/brand";
import { LoginForm } from "@/pages/login/components/login-form.tsx";

export function LoginPage() {
	const { t } = useTranslation("auth");

	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<div className="mb-4 flex justify-center">
					<Brand
						className="justify-center"
						showTagline
						iconContainerClassName="size-11 rounded-2xl"
						nameClassName="text-2xl"
					/>
				</div>
				<h1 className="text-base font-semibold text-foreground">
					{t("title", { ns: "auth" })}
				</h1>
			</div>
			<LoginForm />
		</div>
	);
}
