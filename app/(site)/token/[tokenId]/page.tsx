"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Clock,
  Coins,
  Copy,
  QrCode,
  Shield,
  Tag,
  Users,
  X,
} from "lucide-react";
import prisma from "@/app/lib/utils";
import { getTokenDetail } from "@/app/actions/getTokenDetail";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import QRCodeDisplay from "@/app/components/qr-code-display";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import markTokenAsPaid from "@/app/actions/markTokenAsPaid";

const TokenDetailsPage = () => {
  const { tokenId } = useParams();
  const router = useRouter();
  const [token, setToken] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const { publicKey, signTransaction } = useWallet();
  console.log(publicKey);
  const handlePay = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Wallet not connected");
      return;
    }
    const connection = new Connection(process.env.DEVNET!, "confirmed");
    const recipient = new PublicKey(process.env.ADDRESS!);

    const supply = Number(token?.totalSupply || 0);
    const mintFee = 0.000005 * supply;
    const claimFee = 0.000005 * supply;
    const baseFee = mintFee + claimFee;
    const platformFee = baseFee * 0.02;
    const total = baseFee + platformFee;

    const lamports = Math.round(total * LAMPORTS_PER_SOL);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      await connection.confirmTransaction(signature, "confirmed");

      toast.success("Transaction successful");
      const res = await markTokenAsPaid(token.id, total);
      if (res) {
        toast.success("Token updated in DB");
        setIsPendingPayment(false);
      }
    } catch (error) {
      console.error("Transaction Error", error);
      toast.error("Transaction failed");
    }
  };

  async function fetchTokenDetails() {
    console.log("Token ID:", tokenId);
    if (!tokenId) return;

    setIsLoading(true);
    try {
      const tokenDetail = await getTokenDetail(tokenId as string);
      setToken(tokenDetail);
      console.log(tokenDetail);
      if (!tokenDetail) router.push("/");
    } catch (error) {
      console.error("Failed to fetch token details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTokenDetails();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isAllClaimed = token?.totalClaimedToken === token?.totalSupply;
  const [isPendingPayment, setIsPendingPayment] = useState<boolean>(
    token?.amountPaidForMinting === false
  );

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-6 w-1/3 mb-4" />
                      <div className="grid grid-cols-2 gap-4">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i}>
                              <Skeleton className="h-4 w-1/2 mb-2" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-6 w-1/3 mb-4" />
                      <div className="grid grid-cols-2 gap-4">
                        {Array(2)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i}>
                              <Skeleton className="h-4 w-1/2 mb-2" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Coins className="h-7 w-7 text-purple-600" />
              {token.tokenName}
            </h1>
            <p className="text-muted-foreground mt-1">
              View details and track claims for this experience token
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
            >
              <Tag className="h-3.5 w-3.5" />
              <span>{token.tokenSymbol}</span>
            </Badge>
            {token.minted ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Minted</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Pending</span>
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status Alerts */}
      {isPendingPayment && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Required</AlertTitle>
            <AlertDescription>
              The creator of this token hasn't paid for the transaction yet. The
              QR code will be available once payment is completed.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {isAllClaimed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle>All Tokens Claimed</AlertTitle>
            <AlertDescription>
              All available tokens have been claimed. No more claims are
              possible for this token.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-7/12"
        >
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <span>Token Information</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs bg-white"
                    onClick={() => copyToClipboard(token.id)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy ID
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs
                defaultValue="details"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full grid grid-cols-2 rounded-none bg-muted/30">
                  <TabsTrigger
                    value="details"
                    className="rounded-none data-[state=active]:bg-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Token Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="qrcode"
                    className="rounded-none data-[state=active]:bg-white"
                    disabled={isPendingPayment}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                    {isPendingPayment && (
                      <X className="h-3 w-3 ml-1 text-red-500" />
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-purple-600" />
                        <h3 className="font-bold text-lg">Token Details</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Name
                          </p>
                          <p className="font-medium">{token.tokenName}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Symbol
                          </p>
                          <p className="font-medium">{token.tokenSymbol}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Total Supply
                          </p>
                          <p className="font-medium">{token.totalSupply}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Claimed
                          </p>
                          <p className="font-medium">
                            {token.totalClaimedToken}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Token ID
                          </p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm truncate">
                              {token.id.slice(0, 8) + "..."}
                            </p>
                            <button
                              onClick={() => copyToClipboard(token.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Created At
                          </p>
                          <p className="font-medium text-sm">
                            {formatDate(token.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-lg">
                          Status Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Payment Status
                          </p>
                          <div className="flex items-center gap-2">
                            {!isPendingPayment ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <p className="font-medium text-green-700">
                                  Paid
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <p className="font-medium text-red-700">
                                  Payment Required
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <p className="text-xs text-muted-foreground mb-1">
                            Claim Status
                          </p>
                          <div className="flex items-center gap-2">
                            {isAllClaimed ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <p className="font-medium text-blue-700">
                                  All Claimed
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <p className="font-medium text-green-700">
                                  Available for Claims
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {publicKey &&
                          publicKey?.toString() === token.ownerAddress &&
                          isPendingPayment && (
                            <div className="flex flex-col gap-2">
                              <div className="text-xs text-neutral-500 font-mono">
                                {(() => {
                                  const supply = Number(token.totalSupply);
                                  const mintFee = 0.000005 * supply;
                                  const claimFee = 0.000005 * supply;
                                  const baseFee = mintFee + claimFee;
                                  const platformFee = baseFee * 0.02;
                                  const total = baseFee + platformFee;

                                  return (
                                    <>
                                      Minting Fee: 0.000005 × {supply} ={" "}
                                      <strong>{mintFee.toFixed(6)}</strong>{" "}
                                      <br />
                                      Claiming Fee (prepaid): 0.000005 ×{" "}
                                      {supply} ={" "}
                                      <strong>{claimFee.toFixed(6)}</strong>{" "}
                                      <br />
                                      Platform Fee (2%):{" "}
                                      <strong>
                                        {platformFee.toFixed(6)}
                                      </strong>{" "}
                                      <br />
                                      <span className="text-neutral-700 font-semibold">
                                        Total:{" "}
                                        <strong>{total.toFixed(6)} SOL</strong>
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                              <Button onClick={handlePay}>Pay</Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                        <span className="text-sm font-medium">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                        <span className="text-sm font-medium">Claimed</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-full"
                        style={{
                          width: `${
                            (token.totalClaimedToken / token.totalSupply) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{token.totalClaimedToken} claimed</span>
                      <span>
                        {token.totalSupply - token.totalClaimedToken} remaining
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="qrcode" className="p-6">
                  {isPendingPayment ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="bg-red-50 rounded-full p-4 mb-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        Payment Required
                      </h3>
                      <p className="text-center text-muted-foreground max-w-md mb-4">
                        The QR code will be available once the creator completes
                        payment for this token.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100 mb-4 w-full max-w-xs">
                        <QRCodeDisplay tokenId={tokenId as string} />
                      </div>
                      <p className="text-center text-muted-foreground mb-4">
                        Scan this QR code to claim the token
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            // This would need implementation to download the QR code
                            console.log("Download QR code");
                          }}
                        >
                          Download QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const claimUrl = `${window.location.origin}/claim/${tokenId}`;
                            copyToClipboard(claimUrl);
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy Claim URL
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Side: Claimed Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full lg:w-5/12"
        >
          <Card className="border-none shadow-md h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Claimed Tokens
                <Badge className="ml-2 bg-blue-600">
                  {token.tokens?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {token.tokens?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Token ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Claimed By
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Claimed At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {token.tokens.map((claimedToken: any, index: number) => (
                        <tr
                          key={claimedToken.id}
                          className={`border-b hover:bg-muted/20 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-muted/10"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">
                                {claimedToken.id.slice(0, 8) + "..."}
                              </span>
                              <button
                                onClick={() => copyToClipboard(claimedToken.id)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span>
                                {claimedToken.claimedBy.slice(0, 10) + "..."}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(claimedToken.claimedBy)
                                }
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(claimedToken.claimedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-1">
                    No claimed tokens yet
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    When users claim this token, they will appear here. Share
                    the QR code or claim URL to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenDetailsPage;
