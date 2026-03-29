import type { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig = {
	defaultOptions: {
		queries: {
			retry: 3,
		},
		mutations: {
			networkMode: "offlineFirst",
		},
	},
} as QueryClientConfig;
