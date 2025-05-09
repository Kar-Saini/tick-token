"use client";
import { claimToken } from "@/app/actions/claimToken";
import { getTokenDetail } from "@/app/actions/getTokenDetail";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Claim = () => {
  const navigate = useRouter();
  const { tokenId } = useParams();
  const [tokenDetail, setTokenDetail] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();

  useEffect(() => {
    getTokenData();
  }, []);
  async function getTokenData() {
    const data = await getTokenDetail(tokenId as string);
    setTokenDetail(data);
  }
  async function handleClaim() {
    if (!publicKey) {
      toast.error("Link your wallet");
      return;
    }
    setLoading(true);
    try {
      const result = await claimToken(publicKey.toString(), tokenId as string);
      console.log(result);
      if (result) {
        toast.success("Token claimed, ID: " + result);
      }
    } catch (error) {
      toast.error("Claim unsuccesful" + "\n" + error);
    }
    setLoading(false);
  }
  if (!tokenDetail) return <p>Loading</p>;
  return (
    <div className=" flex flex-col mx-auto max-w-6xl gap-4 justify-center items-center">
      <h1>You are here to claim {tokenDetail.tokenName}</h1>
      <button onClick={handleClaim} disabled={loading}>
        Claim
      </button>
      {loading && <p>Processing</p>}
    </div>
  );
};

export default Claim;
