import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "OAVAS | Industrial Railway Operator Dashboard",
  description: "Onboard Augmented Vision Assistance System (OAVAS) for high-performance obstacle detection and real-time train telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-hidden select-none">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
