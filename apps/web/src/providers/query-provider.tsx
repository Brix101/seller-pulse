import React from 'react';
import { trpc, trpcClient, queryClient } from '@/lib/trpc';
import { QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: React.PropsWithChildren) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
