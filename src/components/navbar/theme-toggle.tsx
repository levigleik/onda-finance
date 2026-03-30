"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/providers/theme-provider.tsx";

export function ThemeToggle() {
	const { toggleTheme, theme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	const isDark = theme === "dark";

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				className="rounded-full disabled:opacity-100" // para não renderizar com opacity menor
				size="icon"
				disabled
			>
				<Moon className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">toggleTheme</span>
			</Button>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					className="rounded-full"
					size="icon"
					onClick={(e) =>
						toggleTheme({
							x: e.clientX,
							y: e.clientY,
						})
					}
				>
					{isDark ? (
						<Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all dark:rotate-0" />
					) : (
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
					)}

					<span className="sr-only">toggleTheme</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent className="font-normal text-sm">
				toggleTheme
			</TooltipContent>
		</Tooltip>
	);
}
