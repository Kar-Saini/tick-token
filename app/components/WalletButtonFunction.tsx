"use client";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

function WalletButtonFunction() {
  return (
    <div className="flex gap-2">
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  );
}

export default WalletButtonFunction;
