import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManiKunj — Cotton On Style Fashion | Women Men Kids",
  description: "ManiKunj — Premium Cotton-On inspired fashion. Shop Women, Men, Kids. Relaxed fits, joyful colours, everyday essentials. Free delivery over ₹1999. Admin CMS fully rebrandable.",
  keywords: ["manikunj", "cotton on", "fashion", "women", "men", "kids", "india", "MK"],
  manifest: "/manifest.json",
  themeColor: "#111111",
  appleWebApp: { capable: true, title: "ManiKunj", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  openGraph: {
    title: "ManiKunj — Wear Your Story",
    description: "Cotton-On inspired fashion for Women, Men & Kids. Trend-led, relaxed, joyful. Shop now at ManiKunj.",
    type: "website",
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
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}`,
          }}
        />
      </body>
    </html>
  );
}
