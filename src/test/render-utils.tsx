import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { FormTransfers } from "@/pages/transfers/form/form-transfers";
import { Providers } from "@/providers";
import { DEFAULT_INITIAL_BALANCE, useAuthStore } from "@/stores/auth-store";
import type { TransferRecord } from "@/stores/transfers-store";
import { useTransfersStore } from "@/stores/transfers-store";
import { TEST_AUTH_USER } from "@/test/fixtures/transfers";

interface RenderWithProvidersOptions
	extends Omit<RenderOptions, "wrapper"> {
	route?: string;
	initialEntries?: string[];
}

interface AuthenticatedSessionOptions {
	user?: {
		name: string;
		email: string;
	};
	balance?: number;
}

interface RenderFormTransfersOptions
	extends RenderWithProvidersOptions,
		AuthenticatedSessionOptions {
	onSuccess?: () => void;
}

interface RenderTransferFlowOptions
	extends RenderWithProvidersOptions,
		AuthenticatedSessionOptions {
	onSuccess?: () => void;
}

const TestProviders = ({
	children,
	initialEntries,
}: {
	children: ReactNode;
	initialEntries: string[];
}) => (
	<Providers>
		<MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
	</Providers>
);

export const seedAuthenticatedSession = ({
	user = TEST_AUTH_USER,
	balance = DEFAULT_INITIAL_BALANCE,
}: AuthenticatedSessionOptions = {}) => {
	const initialState = useAuthStore.getInitialState();

	useAuthStore.setState(
		{
			...initialState,
			isAuthenticated: true,
			user,
			balance,
		},
		true,
	);
};

export const seedTransfers = (transfers: TransferRecord[]) => {
	const initialState = useTransfersStore.getInitialState();

	useTransfersStore.setState(
		{
			...initialState,
			transfers,
		},
		true,
	);
};

export const renderWithProviders = (
	ui: ReactElement,
	{
		route = "/",
		initialEntries = [route],
		...options
	}: RenderWithProvidersOptions = {},
) =>
	render(ui, {
		wrapper: ({ children }) => (
			<TestProviders initialEntries={initialEntries}>{children}</TestProviders>
		),
		...options,
	});

export const renderFormTransfers = ({
	user,
	balance,
	onSuccess,
	...options
}: RenderFormTransfersOptions = {}) => {
	seedAuthenticatedSession({ user, balance });

	return renderWithProviders(<FormTransfers onSuccess={onSuccess} />, options);
};

const TransferFlowHarness = ({ onSuccess }: { onSuccess?: () => void }) => (
	<div className="space-y-8">
		<FormTransfers onSuccess={onSuccess} />
		<DashboardPage />
	</div>
);

export const renderTransferFlow = ({
	user,
	balance,
	onSuccess,
	...options
}: RenderTransferFlowOptions = {}) => {
	seedAuthenticatedSession({ user, balance });

	return renderWithProviders(<TransferFlowHarness onSuccess={onSuccess} />, options);
};
