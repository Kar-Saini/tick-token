import type { Metadata } from "next";
import "./globals.css";
import { SolanaWalletProvider } from "./components/SolanaWalletProvider";
import ClientOnly from "./components/ClientOnly";
import { Coins } from "lucide-react";
import WalletButtonFunction from "./components/WalletButtonFunction";

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
        <ClientOnly>
          <SolanaWalletProvider>
            <div className=" bg-gradient-to-br from-gray-50 to-gray-100 ">
              <div className="container mx-auto max-w-6xl  p-4 md:p-8">
                <Appbar />
                {children}
              </div>
            </div>
          </SolanaWalletProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
function Appbar() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex">
        <Coins className="h-12 w-12 mr-2 text-purple-600" />
        <h1 className="text-5xl font-bold text-center">cToken Admin Portal</h1>
      </div>
      <div className="flex">
        <WalletButtonFunction />
      </div>
    </div>
  );
}
