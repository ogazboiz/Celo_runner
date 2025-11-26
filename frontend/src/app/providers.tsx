'use client';

import { ThirdwebProvider } from 'thirdweb/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/context/WalletContext';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

