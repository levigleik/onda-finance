import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ToggleThemeOptions = {
	x: number;
	y: number;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: (options?: ToggleThemeOptions) => void;
};

const initialState: ThemeProviderState = {
	theme: "dark",
	setTheme: () => null,
	toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const STYLE_ID = "theme-transition-styles";

function injectStyles(css: string) {
	if (typeof window === "undefined") return;

	let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

	if (!style) {
		style = document.createElement("style");
		style.id = STYLE_ID;
		document.head.appendChild(style);
	}

	style.textContent = css;
}

function getMaxRadius(x: number, y: number) {
	const w = window.innerWidth;
	const h = window.innerHeight;

	const distances = [
		Math.hypot(x, y),
		Math.hypot(w - x, y),
		Math.hypot(x, h - y),
		Math.hypot(w - x, h - y),
	];

	return Math.max(...distances);
}

function createAnimationCSS(x: number, y: number, radius: number) {
	return `
		::view-transition-group(root) {
			animation-duration: 0.7s;
			animation-timing-function: ease-out;
		}

		::view-transition-old(root),
		.dark::view-transition-old(root) {
			animation: none;
			z-index: -1;
		}

		::view-transition-new(root) {
			animation: theme-reveal 0.7s ease-out;
		}

		@keyframes theme-reveal {
			from {
				clip-path: circle(0px at ${x}px ${y}px);
			}
			to {
				clip-path: circle(${radius}px at ${x}px ${y}px);
			}
		}
	`;
}

export function ThemeProvider({
	children,
	defaultTheme = "dark",
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() => {
		const saved = localStorage.getItem(storageKey) as Theme | null;
		return saved ?? defaultTheme;
	});

	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
	}, [theme]);

	const setTheme = useCallback(
		(newTheme: Theme) => {
			localStorage.setItem(storageKey, newTheme);
			setThemeState(newTheme);
		},
		[storageKey],
	);

	const toggleTheme = useCallback(
		(options?: ToggleThemeOptions) => {
			const nextTheme = theme === "dark" ? "light" : "dark";

			const applyTheme = () => {
				setTheme(nextTheme);
			};

			if (typeof window === "undefined") {
				applyTheme();
				return;
			}

			const x = options?.x ?? window.innerWidth / 2;
			const y = options?.y ?? window.innerHeight / 2;
			const radius = getMaxRadius(x, y);

			injectStyles(createAnimationCSS(x, y, radius));

			if (!document.startViewTransition) {
				applyTheme();
				return;
			}

			document.startViewTransition(() => {
				applyTheme();
			});
		},
		[theme, setTheme],
	);

	const value = {
		theme,
		setTheme,
		toggleTheme,
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
