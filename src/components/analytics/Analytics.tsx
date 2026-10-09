"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { siteConfig } from "@/config/site";

export function Analytics() {
  const { gtmId, metaPixelId, gaId } = siteConfig;
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    const first = isFirstPath.current;
    isFirstPath.current = false;

    if (metaPixelId && !first && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }

    if (gaId && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname, metaPixelId, gaId]);

  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          className="hidden"
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
