import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/styles/theme";
import "@mantine/core/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Component {...pageProps} />
    </MantineProvider>
  );
}
