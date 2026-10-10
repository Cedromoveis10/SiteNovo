import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingCtas } from "@/components/layout/MobileCtaBar";
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
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-ink">
        {siteConfig.gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
              strategy="beforeInteractive"
            />
            <Script id="ga4" strategy="beforeInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${siteConfig.gaId}', { send_page_view: false });`}
            </Script>
          </>
        ) : null}
        {siteConfig.metaPixelId ? (
          <Script id="meta-pixel" strategy="beforeInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${siteConfig.metaPixelId}');
fbq('track', 'PageView');`}
          </Script>
        ) : null}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCtas />
        </Providers>
        <Analytics />
        {siteConfig.metaPixelId ? (
          <noscript>
            <img
              height={1}
              width={1}
              className="hidden"
              alt=""
              src={`https://www.facebook.com/tr?id=${siteConfig.metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
      </body>
    </html>
  );
}
