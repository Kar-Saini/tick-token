"use client";

import { useEffect, useState } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Coins, Plus, QrCode, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import TokenMintingForm from "./token-minting-form";
import ExisitingTokenCard from "./ExisitingTokenCard";
import { getAllTokenDetail } from "../actions/getAllTokenDetail";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Badge } from "@/app/components/ui/badge";

export default function TokenManagementDashboard() {
  const [existingTokens, setExistingTokens] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllTokens();
  }, []);

  async function getAllTokens() {
    try {
      setIsLoading(true);
      const tokens = await getAllTokenDetail();
      setExistingTokens(tokens);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-2 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Token Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage experience tokens for your attendees
          </p>
        </div>
        <Badge
          variant="outline"
          className="flex items-center gap-2 py-1.5 bg-amber-50 text-amber-700 border-amber-200"
        >
          <Wallet className="h-6 w-6" />
          <span className="text-lg">Solana Network</span>
        </Badge>
      </div>

      <Tabs defaultValue="newToken" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="newToken" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Mint New Tokens
          </TabsTrigger>
          <TabsTrigger
            value="existingToken"
            className="flex items-center gap-2"
          >
            <Coins className="h-4 w-4" />
            Existing Tokens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="newToken">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-purple-100">
                  <QrCode className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Mint Experience Tokens</CardTitle>
                  <CardDescription className="mt-1">
                    Create new cTokens for your experience and generate QR codes
                    for attendees to claim them.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TokenMintingForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="existingToken">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-100">
                  <Coins className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>View Existing Tokens</CardTitle>
                  <CardDescription className="mt-1">
                    View and manage tokens that have already been minted.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-0 h-40">
                        <Skeleton className="h-full w-full" />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : existingTokens && existingTokens.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {existingTokens.map((token) => (
                    <ExisitingTokenCard token={token} key={token.id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">No tokens found</h3>
                  <p className="text-muted-foreground mt-1">
                    You haven't minted any tokens yet. Switch to the "Mint New
                    Tokens" tab to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
