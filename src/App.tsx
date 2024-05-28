import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import Router from "@/components/common/Router";
import { network } from "@/hooks/contract/useTonClient";
import GlobalStyle from "@/styles/globalStyles";
import theme from "@/styles/theme";

console.log(`You're connected to the ${network} network!`);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <GlobalStyle />
        <Router />
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
