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

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
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

	let style = document.getElementById(STYLE_ID) as HTMLStyleElement;

	if (!style) {
		style = document.createElement("style");
		style.id = STYLE_ID;
		document.head.appendChild(style);
	}

	style.textContent = css;
}

function createAnimationCSS() {
	return `
  ::view-transition-group(root) {
    animation-duration: 0.7s;
    animation-timing-function: ease-out;
  }

  ::view-transition-new(root) {
    animation-name: reveal-light;
  }

  ::view-transition-old(root),
  .dark::view-transition-old(root) {
    animation: none;
    z-index: -1;
  }

  .dark::view-transition-new(root) {
    animation-name: reveal-dark;
  }

  @keyframes reveal-dark {
    from {
      clip-path: circle(0% at 0% 0%);
    }
    to {
      clip-path: circle(150% at 0% 0%);
    }
  }

  @keyframes reveal-light {
    from {
      clip-path: circle(0% at 0% 0%);
    }
    to {
      clip-path: circle(150% at 0% 0%);
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
	const [theme, setThemeState] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);

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

	const toggleTheme = useCallback(() => {
		const next = theme === "dark" ? "light" : "dark";

		// injeta animação
		injectStyles(createAnimationCSS());

		const applyTheme = () => setTheme(next);

		// fallback
		if (!document.startViewTransition) {
			applyTheme();
			return;
		}

		document.startViewTransition(applyTheme);
	}, [theme, setTheme]);

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
