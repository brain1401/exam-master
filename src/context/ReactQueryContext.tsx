// Next.js에서는 이 파일을 app/providers.jsx로 부름
"use client";

type Props = {
  children: React.ReactNode;
};

// 서버 컴포넌트에서는 useState나 useRef를 못 써서
// 'use client'를 맨 위에 붙여서 이 부분을 따로 분리함

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 사용할 때는 보통 기본 staleTime을 0보다 크게 설정함
        // 클라이언트에서 바로 리패칭하는 걸 피하기 위해서임
        // stale-while-revalidate 전략 사용함
        staleTime: 0,
        gcTime: Infinity,
        retry: 3,
        refetchOnWindowFocus: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // 서버: 항상 새로운 쿼리 클라이언트 만듦
    return makeQueryClient();
  } else {
    // 브라우저: 없을 때만 새로운 쿼리 클라이언트 만듦
    // 초기 렌더링 중에 React가 suspend되면 새로운 클라이언트를 다시 만들지 않게 하는 게 중요함
    // 쿼리 클라이언트 생성 아래에 suspense 경계가 있으면 이게 필요 없을 수도 있음
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: Props) {
  // 참고: 쿼리 클라이언트 초기화할 때 useState 쓰지 마
  // suspend될 수 있는 코드와 경계가 없으면 초기 렌더링에서 suspend될 때
  // React가 클라이언트를 버릴 수 있음
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
