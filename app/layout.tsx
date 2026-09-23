import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { getThemeId } from "@/lib/appearance";
import { getLang } from "@/lib/i18n";
import Providers from "./providers";
import "@mantine/core/styles.css";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "PersonalCMS",
  // Private while in development: keep it out of search engines
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, themeId] = await Promise.all([getLang(), getThemeId()]);
  return (
    <html lang={lang} className={workSans.variable} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers themeId={themeId}>{children}</Providers>
      </body>
    </html>
  );
}
