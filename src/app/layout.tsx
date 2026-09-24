import type { Metadata } from "next";
import { Figtree, Roboto_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SiteUIProvider } from "@/context/site-ui-context";
import { site } from "@/content/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Baluti & Co. Advocates — Law firm in Kampala, Uganda",
    template: "%s | Baluti & Co. Advocates",
  },
  description:
    "Baluti & Co. Advocates is a full-service law firm in Kampala serving individuals, businesses, and institutions across Uganda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${figtree.variable} ${robotoSerif.variable}`}>
        <body>
          <SiteUIProvider>
            <div className="overflow-x-clip">
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </div>
          </SiteUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
