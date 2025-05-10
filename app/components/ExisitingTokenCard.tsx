"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ExisitingTokenCard = ({ token }: { token: any }) => {
  const navigate = useRouter();
  return (
    <div
      className="rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 space-y-1 hover:cursor-pointer"
      onClick={() => {
        navigate.push(`/token/${token.id}`);
      }}
    >
      <div className="flex justify-between text-sm text-gray-700">
        <div>
          <p className="text-xs text-gray-500">Name</p>
          <p className="font-semibold text-lg">{token.tokenName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Symbol</p>
          <p className="font-semibold text-lg">{token.tokenSymbol}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700">
        <p className="text-xs text-gray-500">Token ID</p>
        <p className="font-medium">{token.id}</p>
      </div>

      <div className="flex justify-between text-sm text-gray-700">
        <div>
          <p className="text-xs text-gray-500">Total Supply</p>
          <p className="font-medium">{token.totalSupply}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Claimed</p>
          <p className="font-medium">{token.totalClaimedToken}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700">
        <p className="text-xs text-gray-500">Creator Address</p>
        <p className="font-mono truncate">
          {token.ownerAddress.slice(0, 20) + "..."}
        </p>
      </div>
    </div>
  );
};

export default ExisitingTokenCard;
