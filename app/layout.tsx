import { Metadata } from "next";
import "./globals.css";
import React from "react";
import Appbar from "./components/Appbar";

export const metadata: Metadata = {
  title: "TickToken",
  description: "TickToken",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Appbar />
        {children}
      </body>
    </html>
  );
}
