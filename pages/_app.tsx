import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Roboto } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { theme } from "@/styles/theme";
import { CookiesProvider } from "react-cookie";

// Load NEXT font for chakra ui
const roboto = Roboto({
  subsets: ["latin"],
  weight: "500",
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-roboto: ${roboto.style.fontFamily};
          }
        `}
      </style>
      <CookiesProvider>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </CookiesProvider>
    </>
  );
};

export default appWithTranslation(App);
