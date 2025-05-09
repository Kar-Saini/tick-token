"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { useWallet } from "@solana/wallet-adapter-react";
import { createAndMintNewToken } from "../actions/createNewToken";
import { toast } from "react-hot-toast";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
const SOLANA_NETWORK = "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_NETWORK);

export default function TokenMintingForm() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [eventRegistration, setEventRegistration] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    publicKey: userWalletPublicKey,
    sendTransaction,
    wallet,
  } = useWallet();
  const [mintingWalletKeypair, setMintingWalletKeypair] =
    useState<Keypair | null>(null);
  const [hasSentSol, setHasSentSol] = useState(false);
  const generateMintingWallet = () => {
    const newKeypair = Keypair.generate();
    setMintingWalletKeypair(newKeypair);
    setError("");
    setHasSentSol(false);
    return newKeypair;
  };
  const fundMintingWallet = async (mintingWalletKeypair: Keypair) => {
    if (!userWalletPublicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }

    if (!mintingWalletKeypair) {
      toast.error("Please generate a minting address first.");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: userWalletPublicKey,
          toPubkey: mintingWalletKeypair.publicKey,
          lamports: 0.1 * LAMPORTS_PER_SOL, // Sends 0.1 SOL
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      setHasSentSol(true);
      toast.success("Done");
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to send SOL. Please try again.");
      toast.error("Failed to send SOL. Please try again.");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tokenName || !tokenSymbol || !tokenAmount) {
      setError("Please fill in all required token fields");
      toast.error(error);
      return;
    }

    if (eventRegistration && (!eventName || !eventDate)) {
      setError("Please fill in all event details");
      toast.error(error);
      return;
    }
    if (!userWalletPublicKey) {
      toast.error("Connect Wallet");
      return;
    }

    setIsLoading(true);
    const keypair = await generateMintingWallet();
    const success = await fundMintingWallet(keypair);

    try {
      if (!hasSentSol) {
        toast.error("SOL not sent");
        return;
      }
      const result = await createAndMintNewToken({
        tokenName,
        tokenAmount,
        tokenSymbol,
        eventDate,
        eventDescription,
        eventName,
        eventRegistration,
        ownerAddress: userWalletPublicKey.toBase58().toString(),
        mintingWalletAddress: keypair?.publicKey.toBase58().toString()!,
      });
      console.log(result);
      if (result) toast.success("Token Minted");
      setTokenName("");
      setTokenSymbol("");
      setTokenAmount(0);
      setEventRegistration(false);
      setEventName("");
      setEventDate("");
      setEventDescription("");
      setIsLoading(false);
      setError("");
    } catch (err) {
      setError("Failed to mint tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Token Details</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name *</Label>
            <Input
              id="tokenName"
              placeholder="Experience Token"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol *</Label>
            <Input
              id="tokenSymbol"
              placeholder="cTKN"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              required
              maxLength={5}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tokenAmount">Amount to Mint *</Label>
          <Input
            id="tokenAmount"
            type="number"
            min={1}
            placeholder="100"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(Number.parseInt(e.target.value))}
            required
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Event Registration</h3>
            <p className="text-sm text-gray-500">
              Associate these tokens with an event
            </p>
          </div>
          <Switch
            checked={eventRegistration}
            onCheckedChange={setEventRegistration}
          />
        </div>

        {eventRegistration && (
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name *</Label>
              <Input
                id="eventName"
                placeholder="Blockchain Summit 2023"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required={eventRegistration}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDescription">Event Description *</Label>
              <Input
                id="eventDescription"
                type="text"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required={eventRegistration}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required={eventRegistration}
              />
            </div>
          </div>
        )}
      </div>
      <Separator />

      <div className="space-y-2">
        <Label htmlFor="fundingAgreement">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="fundingAgreement"
              required
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              I understand that I will be required to create a new Solana public
              key to pay network fees for minting and claiming tokens. I must
              fund this address with at least <strong>0.1 SOL</strong>. The
              private key of this address will be mine and will be used to
              authorize these transactions.
            </span>
          </div>
        </Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            "Mint Tokens"
          )}
        </Button>
      </div>
    </form>
  );
}
