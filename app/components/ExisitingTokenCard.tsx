"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const ExisitingTokenCard = ({ token }: { token: any }) => {
  console.log(token);
  const navigate = useRouter();
  return (
    <div
      className={clsx(
        "rounded-2xl p-6  shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 space-y-1 hover:cursor-pointer",
        !token.minted ? "bg-gray-200 opacity-75" : "bg-white"
      )}
      onClick={() => {
        if (token.minted) navigate.push(`/token/${token.id}`);
        else toast.error("This token failed to Mint");
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

      <div className="text-sm text-gray-700 flex justify-between flex-col">
        <p className="text-xs text-gray-500">Creator Address</p>
        <p className="font-mono truncate">{token.ownerAddress}</p>
      </div>
      <div className="text-sm text-gray-700 flex justify-between flex-col">
        <p className="text-xs text-gray-500">Creator At</p>
        <p className="font-mono truncate">{token.createdAt.toString()}</p>
      </div>
      <div className="text-sm text-gray-700 flex justify-between flex-col">
        <p className="text-xs text-gray-500">Mint</p>
        <p
          className={clsx(
            "font-mono truncate text-md font-bold",
            !token.minted ? "text-red-500" : "text-green-500"
          )}
        >
          {token.minted ? "Success" : "Failure"}
        </p>
      </div>
    </div>
  );
};

export default ExisitingTokenCard;
