"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenMintingForm from "./token-minting-form";
import QRCodeDisplay from "./qr-code-display";
import { Coins } from "lucide-react";
import ExisitingTokenCard from "./ExisitingTokenCard";

export default function AdminDashboard() {
  const [tokenData, setTokenData] = useState<{
    tokenName: string;
    tokenSymbol: string;
    tokenAmount: number;
    eventRegistration: boolean;
    eventName?: string;
    eventDate?: string;
  } | null>(null);

  const handleMintingComplete = (data: any) => {
    setTokenData(data);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center justify-center mb-8">
        <Coins className="h-8 w-8 mr-2 text-purple-600" />
        <h1 className="text-3xl font-bold text-center">cToken Admin Portal</h1>
      </div>

      <Tabs defaultValue="newToken" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="newToken">Mint New Tokens</TabsTrigger>
          <TabsTrigger value="existingToken">Existing Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="newToken">
          <Card>
            <CardHeader>
              <CardTitle>Mint Experience Tokens</CardTitle>
              <CardDescription>
                Create new cTokens for your experience and generate QR codes for
                attendees to claim them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TokenMintingForm onMintingComplete={handleMintingComplete} />
            </CardContent>
          </Card>

          {tokenData && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Minting Successful</CardTitle>
                <CardDescription>
                  Share the QR code with attendees to claim their tokens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeDisplay data={tokenData} />
              </CardContent>
              <CardFooter className="flex justify-end">
                <p className="text-sm text-gray-500">
                  Token ID:{" "}
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="existingToken">
          <Card>
            <CardHeader>
              <CardTitle>View Existing Tokens</CardTitle>
              <CardDescription>
                View and manage tokens that have already been minted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 row-span-3">
                <ExisitingTokenCard />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
