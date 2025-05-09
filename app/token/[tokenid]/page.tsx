"use client";
import { getTokenDetail } from "@/app/actions/getTokenDetail";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import QRCodeDisplay from "@/app/components/qr-code-display";

const page = () => {
  const { tokenId } = useParams();
  const navigate = useRouter();
  const [token, setToken] = useState<any>();
  useEffect(() => {
    if (!tokenId) navigate.push("/");
    details();
  }, []);
  async function details() {
    const tokenDetial = await getTokenDetail(tokenId as string);
    setToken(tokenDetial);
    if (!tokenDetial) navigate.push("/");
  }
  if (!token) return <p>Loading...</p>;
  return (
    <div className="mx-auto max-w-6xl flex justify-center items-center gap-2">
      <div className="flex flex-col items-center max-w-6xl justify-center h-full">
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              TOKEN: {token.tokenName}
            </CardTitle>
            <CardDescription>
              View and manage tokens that have already been minted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="space-y-4 flex justify-between w-full">
                <div>
                  <h3 className="font-bold text-lg">Token Details</h3>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-bold">Name:</p>
                      <p className="text-sm">{token.tokenName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Symbol:</p>
                      <p className="text-sm">{token.tokenSymbol}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Supply:</p>
                      <p className="text-sm">{token.totalSupply}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Claimed:</p>
                      <p className="text-sm">{token.totalClaimedToken}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Token ID:</p>
                      <p className="text-sm">{token.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Creator:</p>
                      <p className="text-sm">{token.address}</p>
                    </div>
                  </div>
                </div>

                {token.eventName && (
                  <div>
                    <h3 className="font-bold text-lg">Event Details</h3>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-bold">Event Name:</p>
                        <p className="text-sm">{token.eventName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Event Date:</p>
                        <p className="text-sm">{token.eventDate}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-neutral-200 rounded-lg">
        <QRCodeDisplay qrString={token.qrString || "Kartrik"} />
      </div>
    </div>
  );
};

export default page;
