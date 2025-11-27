'use client';

import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/context/WalletContext";
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#7B61FF',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF6B6B',
                secondary: '#fff',
              },
            },
          }}
        />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
