import React from "react";
import { SolanaWalletProvider } from "../components/SolanaWalletProvider";
import ClientOnly from "../components/ClientOnly";
import WalletButtonFunction from "../components/WalletButtonFunction";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "TokenXperience",
  description: "TokenXperience",
};
const SiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <ClientOnly>
        <SolanaWalletProvider>
          <div className=" bg-gradient-to-br from-gray-50 to-gray-100 ">
            <div className="container mx-auto max-w-8xl  p-4 md:p-8">
              <AppbarWalletButtons />
              {children}
            </div>
          </div>
        </SolanaWalletProvider>
      </ClientOnly>
    </>
  );
};
function AppbarWalletButtons() {
  return (
    <div className="flex items-center justify-end mb-2">
      <WalletButtonFunction />
    </div>
  );
}
export default SiteLayout;
