"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Toaster } from "react-hot-toast";

const wallets = [new PhantomWalletAdapter(), new UnsafeBurnerWalletAdapter()];

export const SolanaWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ConnectionProvider endpoint={process.env.DEVNET!}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Toaster />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
