import React from "react";
import QRCodeDisplay from "./qr-code-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

// You can customize this mock object or pass it as props
const tokenData = {
  tokenName: "Experience Token",
  tokenSymbol: "EXP",
  tokenAmount: 1000,
  eventRegistration: true,
  eventName: "Web3 Conference",
  eventDate: "2025-06-10",
};

const TokenDetailsCard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            TOKEN: {tokenData.tokenName}
          </CardTitle>
          <CardDescription>
            View and manage tokens that have already been minted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">Token Details</h3>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-bold">Name:</p>
                    <p className="text-sm">{tokenData.tokenName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Symbol:</p>
                    <p className="text-sm">{tokenData.tokenSymbol}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Amount:</p>
                    <p className="text-sm">{tokenData.tokenAmount}</p>
                  </div>
                </div>
              </div>

              {tokenData.eventRegistration && (
                <div>
                  <h3 className="font-bold text-lg">Event Details</h3>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-bold">Event Name:</p>
                      <p className="text-sm">{tokenData.eventName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Event Date:</p>
                      <p className="text-sm">{tokenData.eventDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <QRCodeDisplay data={tokenData} /> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenDetailsCard;
