import { Outlet } from "react-router";

export const AuthLayout = () => {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md rounded-xl bg-background p-6 shadow-md border">
				<Outlet />
			</div>
		</div>
	);
};
