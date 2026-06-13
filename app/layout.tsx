import type { Metadata, Viewport } from "next";
import "./globals.css";
import Grainient from "@/components/Grainient";
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
        <Grainient
          className="grainient-bg"
          color1="#000000"
          color2="#828282"
          color3="#000000"
          timeSpeed={0.4}
          colorBalance={0.01}
          warpStrength={0.95}
          warpFrequency={1.2}
          warpSpeed={1.1}
          warpAmplitude={16}
          blendAngle={126}
          blendSoftness={0.18}
          rotationAmount={690}
          noiseScale={1.15}
          grainAmount={0.1}
          grainScale={1.8}
          grainAnimated={false}
          contrast={1}
          gamma={1.0}
          saturation={1.15}
          centerX={0.13}
          centerY={0.7}
          zoom={1}
        />
        {children}
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Spotlight />
      </body>
    </html>
  );
}
