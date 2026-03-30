import { Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import "@/i18n";
import { Providers } from "@/providers";
import { router } from "@/routes/routes.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Providers>
			<Suspense fallback={null}>
				<RouterProvider router={router} />
			</Suspense>
		</Providers>
	</StrictMode>,
);
