import { Home, User } from "lucide-react";
import { Link } from "react-router";

export const DashboardPage = () => (
	<div className="w-full max-w-md p-6">
		<Link to={"/"}>
			Home <Home />{" "}
		</Link>
		<Link to={"/login"}>
			Login <User />{" "}
		</Link>
	</div>
);
