"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TokenMintingFormProps {
  onMintingComplete: (data: any) => void;
}

export default function TokenMintingForm({
  onMintingComplete,
}: TokenMintingFormProps) {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [eventRegistration, setEventRegistration] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!tokenName || !tokenSymbol || !tokenAmount) {
      setError("Please fill in all required token fields");
      return;
    }

    if (eventRegistration && (!eventName || !eventDate)) {
      setError("Please fill in all event details");
      return;
    }

    setIsLoading(true);

    // Simulate minting process
    try {
      // In a real app, this would be an API call to mint tokens
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onMintingComplete({
        tokenName,
        tokenSymbol,
        tokenAmount,
        eventRegistration,
        eventName,
        eventDate,
      });
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
