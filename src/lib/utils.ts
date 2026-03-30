import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getInitials = (name?: string) => {
	if (!name) return "US";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.substring(0, 2)
		.toUpperCase();
};
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
