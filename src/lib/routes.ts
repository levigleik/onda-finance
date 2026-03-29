import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/components/layout/auth-layout.tsx";
import { RootLayout } from "@/components/layout/root-layout.tsx";
import { HomePage } from "@/pages/home/home-page.tsx";
import { LoginPage } from "@/pages/login/login-page.tsx";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: RootLayout,
		children: [
			{ index: true, Component: HomePage },
			{
				path: "",
				Component: AuthLayout,
				children: [{ path: "login", Component: LoginPage }],
			},
			{
				path: "concerts",
				children: [{ index: true, Component: HomePage }],
			},
		],
	},
]);
