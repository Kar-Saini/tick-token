"use client";
import { useEffect, useState } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

require("@solana/wallet-adapter-react-ui/styles.css");

export default function AdminDashboard() {
  const [existingTokens, setExistingTokens] = useState<any>();
  useEffect(() => {
    getAllTokens();
  }, []);
  async function getAllTokens() {
    const tokens = await getAllTokenDetail();
    setExistingTokens(tokens);
  }
  return (
    <div className="">
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
              <TokenMintingForm />
            </CardContent>
          </Card>
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
              <div className="grid grid-cols-3 gap-4 row-span-3 ">
                {/* {!existingTokens && <p>Loading...</p>} */}
                {existingTokens &&
                  existingTokens.map((token) => (
                    <ExisitingTokenCard token={token} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
