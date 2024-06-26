import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import Router from "@/components/common/Router";
import { network } from "@/hooks/contract/useTonClient";
import GlobalStyle from "@/styles/globalStyles";
import theme from "@/styles/theme";
import QueryClientProvider2 from "./queryClient";
import QueryClientProviderPussy from "./queryClientPussy";
import "./styles/index.scss";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

console.log(`You're connected to the ${network} network!`);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <QueryClientProvider2>
          <QueryClientProviderPussy>
            <RecoilRoot>
              <GlobalStyle />
              <Router />
            </RecoilRoot>
          </QueryClientProviderPussy>
        </QueryClientProvider2>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
