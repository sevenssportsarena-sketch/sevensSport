import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sevenssportsarena.com.ng"),
  title: {
    default: "Sevens Sports Arena – Live Sports News & Analysis",
    template: "%s | Sevens Sports Arena",
  },
  description: "Your ultimate destination for real-time sports news, match reports, transfer rumours, and interactive discussions.",
  keywords: ["Sports", "News", "European Football", "Nigerian Football", "NBA", "Athletics", "Formula 1", "Tennis"],
  authors: [{ name: "SevensSportsArena" }],
  creator: "SevensSportsArena",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://sevenssportsarena.com.ng",
    title: "Sevens Sports Arena – Live Sports News & Analysis",
    description: "Your ultimate destination for real-time sports news, match reports, transfer rumours, and interactive discussions.",
    siteName: "Sevens Sports Arena",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sevens Sports Arena – Live Sports News & Analysis",
    description: "Your ultimate destination for real-time sports news, match reports, transfer rumours, and interactive discussions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
