"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // stale-while-revalidate 전략을 사용합니다.
      staleTime: 0,
      gcTime: Infinity,
    },
  },
});

type Props = {
  children: React.ReactNode;
};
export default function ReactQueryContext({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
