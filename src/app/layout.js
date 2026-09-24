import { Geist, Geist_Mono } from "next/font/google";
import { ProductOverridesProvider } from "@/context/ProductOverridesContext";
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
  title: "Product Admin Dashboard",
  description: "Admin dashboard for managing products using DummyJSON",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ProductOverridesProvider>{children}</ProductOverridesProvider>
      </body>
    </html>
  );
}
