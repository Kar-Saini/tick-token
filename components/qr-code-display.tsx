"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface QRCodeDisplayProps {
  tokenData: {
    tokenName: string;
    tokenSymbol: string;
    tokenAmount: number;
    eventRegistration: boolean;
    eventName?: string;
    eventDate?: string;
  };
}

export default function QRCodeDisplay({ tokenData }: QRCodeDisplayProps) {
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    // Create a claim URL with token data
    // In a real app, this would be a unique URL to claim tokens
    const claimData = {
      token: tokenData.tokenSymbol,
      id: Math.random().toString(36).substring(2, 15),
      event: tokenData.eventRegistration ? tokenData.eventName : undefined,
    };

    setQrValue(JSON.stringify(claimData));
  }, [tokenData]);

  const handleDownload = () => {
    const svg = document.getElementById("token-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      // Download the PNG file
      const downloadLink = document.createElement("a");
      downloadLink.download = `${tokenData.tokenSymbol}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    // In a real app, this would generate a shareable link
    alert(
      "Share functionality would be implemented here with a unique claim URL"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h3 className="font-medium">Claim QR Code</h3>

      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG
          id="token-qr-code"
          value={qrValue}
          size={180}
          level="H"
          includeMargin
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>

      <p className="text-xs text-center text-gray-500 max-w-[200px]">
        Attendees can scan this QR code to claim their experience tokens
      </p>

      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <Button size="sm" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
}
