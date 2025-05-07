import React from "react";

const ExisitingTokenCard = () => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white">
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Name:</span> Experience Token
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Token ID:</span> ABCD1234
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Event:</span> Web3 Summit 2025
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Symbol:</span> EXP
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-semibold">Supply:</span> 1000
      </p>
    </div>
  );
};

export default ExisitingTokenCard;
