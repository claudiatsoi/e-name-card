import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Your Digital Name card in 5 seconds!",
  description: "Powered by Claudia Tsoi",
  manifest: "/manifest.json",
  icons: {
    icon: '/eventx-logo.png',
  },
  openGraph: {
    title: "Create Your Digital Name card in 5 seconds!",
    description: "Powered by Claudia Tsoi",
    images: ['/eventx-logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
