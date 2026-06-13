import type { Metadata, Viewport } from "next";
import "./globals.css";
import Spotlight from "@/components/Spotlight";

export const metadata: Metadata = {
  metadataBase: new URL("https://byanyothername.com"),
  title: "By Any Other Name — a creative studio",
  description:
    "Concepts, productions and identities for the spaces in between. A creative studio for brands, venues and what happens after dark.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Spotlight />
      </body>
    </html>
  );
}
