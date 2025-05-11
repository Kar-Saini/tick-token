"use client";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

function WalletButtonFunction() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  );
}

export default WalletButtonFunction;
