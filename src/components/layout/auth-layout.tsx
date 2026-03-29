import { Outlet } from "react-router";

export const AuthLayout = () => {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md border border-slate-200">
				Auth
				<Outlet />
			</div>
		</div>
	);
};
