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

  async function details() {
    console.log("Token ID:", tokenId);
    if (!tokenId) return;
    const tokenDetail = await getTokenDetail(tokenId as string);
    setToken(tokenDetail);
    console.log(tokenDetail);
    if (!tokenDetail) navigate.push("/");
  }

  useEffect(() => {
    details();
  }, []);

  if (!token) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-full flex flex-col items-center gap-6 p-4">
      <div className="flex md:flex-row justify-center items-start gap-4 w-full">
        <div className="flex flex-col w-full max-w-3xl gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                TOKEN: {token.tokenName}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6 w-full">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="w-full">
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
                        <p className="text-sm">
                          {token.id.slice(0, 8) + "..."}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Creator:</p>
                        <p className="text-sm">
                          {token.ownerAddress.slice(0, 10) + "..."}
                        </p>
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
                <div className="bg-neutral-200 rounded-lg p-4">
                  <QRCodeDisplay tokenId={tokenId as string} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Claimed Users Table */}
        {token.tokens?.length > 0 && (
          <div className="w-full max-w-2xl mt-0">
            <h2 className="text-2xl font-semibold mb-2">Claimed Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border text-left">
                      Claimed Token ID
                    </th>
                    <th className="px-4 py-2 border text-left">Claimed By</th>
                    <th className="px-4 py-2 border text-left">Claimed At</th>
                  </tr>
                </thead>
                <tbody>
                  {token.tokens.map((claimedToken: any) => (
                    <tr key={claimedToken.id}>
                      <td className="px-4 py-2 border">
                        {claimedToken.id.slice(0, 8) + "..."}
                      </td>
                      <td className="px-4 py-2 border">
                        {claimedToken.claimedBy.slice(0, 10) + "..."}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(claimedToken.claimedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
