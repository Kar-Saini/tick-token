"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay({ tokenId }: { tokenId: string }) {
  if (!tokenId) return <p>No QR availble</p>;
  return (
    <div className="flex flex-col items-center  space-y-2 p-2 border rounded-lg ">
      <h3 className="font-medium">QR Code : Claim Token</h3>
      <div className="bg-white rounded-lg">
        <QRCodeSVG value={`/claim/${tokenId}`} size={256} level="M" />
      </div>

      <p className="text-xs text-center text-gray-500 max-w-[200px]">
        Attendees can scan this QR code to claim their experience tokens
      </p>
    </div>
  );
}
