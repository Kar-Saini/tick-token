"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Coins,
  Loader2,
  QrCode,
  Shield,
  Sparkles,
  Wallet,
  PenLine,
} from "lucide-react";

import { claimToken } from "@/app/actions/claimToken";
import { getTokenDetail } from "@/app/actions/getTokenDetail";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";

const Claim = () => {
  const router = useRouter();
  const { tokenId } = useParams();
  const { publicKey, connected } = useWallet();

  const [tokenDetail, setTokenDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addressOption, setAddressOption] = useState("connected");
  const [manualAddress, setManualAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    fetchTokenDetail();
  }, []);

  const fetchTokenDetail = async () => {
    if (!tokenId) return;
    setIsLoading(true);
    try {
      const data = await getTokenDetail(tokenId as string);
      setTokenDetail(data);
    } catch (error) {
      toast.error("Failed to load token details");
    } finally {
      setIsLoading(false);
    }
  };

  const validateSolanaAddress = (address: string) => {
    // Basic validation - Solana addresses are 44 characters long
    // This is a simple check, you might want to use a more robust validation
    return address.length === 44 || address.length === 43;
  };

  const handleClaim = async () => {
    let walletAddress = "";

    if (addressOption === "connected") {
      if (!publicKey) {
        toast.error("Please connect your wallet.");
        return;
      }
      walletAddress = publicKey.toString();
    } else {
      // Validate manual address
      if (!manualAddress.trim()) {
        setAddressError("Please enter a wallet address");
        return;
      }

      if (!validateSolanaAddress(manualAddress.trim())) {
        setAddressError("Please enter a valid Solana wallet address");
        return;
      }

      walletAddress = manualAddress.trim();
      setAddressError("");
    }

    setLoading(true);
    try {
      const result = await claimToken(walletAddress, tokenId as string);
      if (result) {
        toast.success(`Token claimed successfully! ID: ${result}`);
      }
    } catch (error: any) {
      toast.error(`Claim unsuccessful\n${error.message || error}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {isLoading ? (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg border-b pb-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
              <Skeleton className="h-24 w-24 rounded-full mb-6" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg border-b relative">
              <div className="absolute top-0 right-0 p-3">
                <Badge
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  <Wallet className="h-3 w-3 mr-1" />
                  Solana
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Claim Your Token
              </CardTitle>
              <CardDescription>
                Choose how you want to claim this exclusive digital collectible
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 pb-4 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Coins className="h-12 w-12 text-white" />
                </div>
                <motion.div
                  className="absolute -right-2 -bottom-2 bg-white rounded-full p-1 shadow-md border border-purple-100"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <QrCode className="h-6 w-6 text-purple-600" />
                </motion.div>
              </motion.div>

              <h2 className="text-xl font-bold text-center mb-1">
                {tokenDetail?.tokenName || "Experience Token"}
              </h2>

              <p className="text-muted-foreground text-center mb-4">
                {tokenDetail?.description ||
                  "A unique digital collectible for your experience"}
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <p className="text-xs text-muted-foreground mb-1">
                    Created By
                  </p>
                  <p className="font-medium truncate">
                    {tokenDetail?.ownerAddress?.slice(0, 10) + "..." ||
                      "TokenXperience"}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-xs text-muted-foreground mb-1">Token ID</p>
                  <p className="font-medium truncate">
                    {tokenDetail?.id?.slice(0, 8) + "..." || "Experience"}
                  </p>
                </div>
              </div>

              {/* Wallet Address Selection */}
              <div className="w-full mb-6 space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <RadioGroup
                    value={addressOption}
                    onValueChange={setAddressOption}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="connected" id="connected" />
                      <Label
                        htmlFor="connected"
                        className="flex items-center cursor-pointer"
                      >
                        <Wallet className="h-4 w-4 mr-2 text-purple-600" />
                        <span>Use Connected Wallet</span>
                        {!connected && (
                          <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Not Connected
                          </Badge>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label
                        htmlFor="manual"
                        className="flex items-center cursor-pointer"
                      >
                        <PenLine className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Enter Wallet Address</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {addressOption === "manual" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-3"
                    >
                      <Label
                        htmlFor="walletAddress"
                        className="text-sm font-medium mb-1.5 block"
                      >
                        Solana Wallet Address
                      </Label>
                      <Input
                        id="walletAddress"
                        placeholder="Enter your Solana wallet address"
                        value={manualAddress}
                        onChange={(e) => {
                          setManualAddress(e.target.value);
                          if (addressError) setAddressError("");
                        }}
                        className={addressError ? "border-red-300" : ""}
                      />
                      {addressError && (
                        <p className="text-red-500 text-xs mt-1">
                          {addressError}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={handleClaim}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Claim Token
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-4"
        >
          By claiming this token, you'll receive a unique digital collectible in
          your wallet
        </motion.p>
      </motion.div>

      {/* Background decorative elements */}
      <div className="fixed -z-10 top-1/4 left-10 opacity-10">
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Coins className="h-32 w-32 text-purple-300" />
        </motion.div>
      </div>
      <div className="fixed -z-10 bottom-1/4 right-10 opacity-10">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Shield className="h-40 w-40 text-blue-300" />
        </motion.div>
      </div>
    </div>
  );
};

export default Claim;
