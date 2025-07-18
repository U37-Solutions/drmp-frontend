'use client';
import { QueryClient, QueryClientProvider as TanStackSQueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <TanStackSQueryClientProvider client={queryClient}>{children}</TanStackSQueryClientProvider>;
};

export default QueryClientProvider;
