import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { Providers } from "@/providers";
import { router } from "@/routes/routes.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers>
			<RouterProvider router={router} />,
		</Providers>
	</StrictMode>,
);
