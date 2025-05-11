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

const INITIAL_TOKEN_DATA = {
  tokenName: "",
  tokenSymbol: "",
  tokenAmount: 10,
  ownerAddress: "",
  mintingWalletAddress: "",
  eventRegistration: false,
  eventName: "",
  eventDate: "",
  eventDescription: "",
};

export default function TokenMintingForm() {
  const [tokenData, setTokenData] = useState(INITIAL_TOKEN_DATA);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey: userWalletPublicKey } = useWallet();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setTokenData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setTokenData((prev) => ({ ...prev, eventRegistration: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !tokenData.tokenName ||
      !tokenData.tokenSymbol ||
      !tokenData.tokenAmount
    ) {
      setError("Please fill in all required token fields");
      toast.error("Please fill in all required token fields");
      return;
    }

    if (
      tokenData.eventRegistration &&
      (!tokenData.eventName || !tokenData.eventDate)
    ) {
      setError("Please fill in all event details");
      toast.error("Please fill in all event details");
      return;
    }

    if (!userWalletPublicKey) {
      toast.error("Connect Wallet");
      return;
    }

    try {
      setIsLoading(true);
      const result = await createAndMintNewToken({
        ...tokenData,
        tokenAmount: Number(tokenData.tokenAmount),
        ownerAddress: userWalletPublicKey.toBase58(),
      });
      if (result) toast.success("Token Minted");
      setTokenData(INITIAL_TOKEN_DATA);
      setError("");
    } catch (err) {
      setError("Failed to mint tokens. Please try again.");
      toast.error("Failed to mint tokens. Please try again.");
      console.log(err);
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
              name="tokenName"
              placeholder="Experience Token"
              value={tokenData.tokenName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol *</Label>
            <Input
              id="tokenSymbol"
              name="tokenSymbol"
              placeholder="cTKN"
              value={tokenData.tokenSymbol}
              onChange={handleInputChange}
              required
              maxLength={5}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tokenAmount">Amount to Mint *</Label>
          <Input
            id="tokenAmount"
            name="tokenAmount"
            type="number"
            min={1}
            placeholder="100"
            value={tokenData.tokenAmount}
            onChange={handleInputChange}
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
            checked={tokenData.eventRegistration}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        {tokenData.eventRegistration && (
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name *</Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="Blockchain Summit 2023"
                value={tokenData.eventName}
                onChange={handleInputChange}
                required={tokenData.eventRegistration}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDescription">Event Description *</Label>
              <Input
                id="eventDescription"
                name="eventDescription"
                type="text"
                value={tokenData.eventDescription}
                onChange={handleInputChange}
                required={tokenData.eventRegistration}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={tokenData.eventDate}
                onChange={handleInputChange}
                required={tokenData.eventRegistration}
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
              I understand that the tokens will be minted by the platform
              address first. To allow user's to claim these tokens, I must fund
              the platform's Solana wallet{" "}
              <strong>once the tokens are minted</strong> to cover the network
              fees for miniting and claiming transactions.
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
