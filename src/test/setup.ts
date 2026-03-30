import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import i18n from "@/i18n";
import { DEFAULT_LANGUAGE } from "@/i18n/config";
import { useAuthStore } from "@/stores/auth-store";
import { useTransferModalStore } from "@/stores/transfer-modal-store";
import { useTransfersStore } from "@/stores/transfers-store";
import { TEST_NOW } from "@/test/fixtures/transfers";

class ResizeObserverMock implements ResizeObserver {
	observe() {}

	unobserve() {}

	disconnect() {}
}

const RealDate = Date;

class MockDate extends RealDate {
	constructor(...args: any[]) {
		switch (args.length) {
			case 0:
				super(TEST_NOW.getTime());
				break;
			case 1:
				super(args[0]);
				break;
			case 2:
				super(args[0], args[1]);
				break;
			case 3:
				super(args[0], args[1], args[2]);
				break;
			case 4:
				super(args[0], args[1], args[2], args[3]);
				break;
			case 5:
				super(args[0], args[1], args[2], args[3], args[4]);
				break;
			case 6:
				super(args[0], args[1], args[2], args[3], args[4], args[5]);
				break;
			default:
				super(
					args[0],
					args[1],
					args[2],
					args[3],
					args[4],
					args[5],
					args[6],
				);
		}
	}

	static now() {
		return TEST_NOW.getTime();
	}
}

const createViewTransition = (): ViewTransition => ({
	finished: Promise.resolve(),
	ready: Promise.resolve(),
	types: new Set() as ViewTransitionTypeSet,
	updateCallbackDone: Promise.resolve(),
	skipTransition: () => undefined,
});

const resetStores = () => {
	useAuthStore.setState(useAuthStore.getInitialState(), true);
	useTransfersStore.setState(useTransfersStore.getInitialState(), true);
	useTransferModalStore.setState(useTransferModalStore.getInitialState(), true);
	useAuthStore.persist.clearStorage();
	useTransfersStore.persist.clearStorage();
};

if (!window.matchMedia) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			addListener: () => undefined,
			removeListener: () => undefined,
			dispatchEvent: () => false,
		}),
	});
}

if (!window.ResizeObserver) {
	Object.defineProperty(window, "ResizeObserver", {
		writable: true,
		value: ResizeObserverMock,
	});
}

if (!globalThis.ResizeObserver) {
	Object.defineProperty(globalThis, "ResizeObserver", {
		writable: true,
		value: ResizeObserverMock,
	});
}

if (!window.PointerEvent) {
	class PointerEventMock extends MouseEvent {}

	Object.defineProperty(window, "PointerEvent", {
		writable: true,
		value: PointerEventMock,
	});
}

if (!HTMLElement.prototype.scrollIntoView) {
	HTMLElement.prototype.scrollIntoView = () => undefined;
}

if (!HTMLElement.prototype.hasPointerCapture) {
	HTMLElement.prototype.hasPointerCapture = () => false;
}

if (!HTMLElement.prototype.releasePointerCapture) {
	HTMLElement.prototype.releasePointerCapture = () => undefined;
}

Object.defineProperty(document, "startViewTransition", {
	configurable: true,
	writable: true,
	value: (
		callbackOptions?: ViewTransitionUpdateCallback | StartViewTransitionOptions,
	) => {
		const callback =
			typeof callbackOptions === "function"
				? callbackOptions
				: callbackOptions?.update;

		callback?.();

		return createViewTransition();
	},
});

beforeEach(async () => {
	vi.useRealTimers();
	vi.stubGlobal("Date", MockDate);
	localStorage.clear();
	resetStores();
	await i18n.changeLanguage(DEFAULT_LANGUAGE);
	document.documentElement.className = "";
	document.getElementById("theme-transition-styles")?.remove();
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.useRealTimers();
	vi.unstubAllGlobals();
	localStorage.clear();
	resetStores();
	document.documentElement.className = "";
	document.getElementById("theme-transition-styles")?.remove();
});
