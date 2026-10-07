import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar, WhatsAppButton } from "@/components/layout/MobileCtaBar";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { absoluteMediaUrl } from "@/lib/media";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.legalName} | Móveis de alto padrão em Florianópolis`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "móveis de alto padrão",
    "móveis premium",
    "móveis de design",
    "mesas de jantar",
    "cadeiras de design",
    "banquetas",
    "Florianópolis",
    "Cedro Móveis",
  ],
  openGraph: {
    title: siteConfig.legalName,
    description: siteConfig.description,
    locale: siteConfig.locale,
    type: "website",
    siteName: siteConfig.legalName,
    images: [{ url: absoluteMediaUrl("/brand/logo-transparent.png"), width: 499, height: 318, alt: siteConfig.legalName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.legalName,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-ink">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
        <Providers>
          <Header />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileCtaBar />
          <WhatsAppButton />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
