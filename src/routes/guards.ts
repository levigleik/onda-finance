import { redirect } from "react-router";
import { useAuthStore } from "@/stores/auth-store";

export const requireAuthLoader = () => {
	const { isAuthenticated } = useAuthStore.getState();

	if (!isAuthenticated) {
		return redirect("/login");
	}

	// Lógica de autenticação com uma api mesmo

	return null;
};

export const requireGuestLoader = () => {
	const { isAuthenticated } = useAuthStore.getState();
	if (isAuthenticated) {
		return redirect("/");
	}
	return null;
};
