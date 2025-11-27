import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Inter } from "next/font/google";
import { theme } from "@/styles/theme";
import "@mantine/core/styles.css";

// Load Inter font with Latin subset
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
