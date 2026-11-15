import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TransferHub | Universal file transfer",
  description:
    "A self-hostable, browser-first workspace for secure remote file transfers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
