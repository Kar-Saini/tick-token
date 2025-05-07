import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/utils";

import { HeliusClient } from "@helius-labs/helius-sdk";
interface tokenData {
  tokenName: string;
  tokenSymbol: string;
  address: string;
  tokenAmount: number;
  eventRegistration?: boolean;
  eventName?: string;
  eventDate?: string;
  eventDescription?: string;
}

export async function createNewToken(tokenData: tokenData) {
  try {
    const data: any = {
      tokenName: tokenData.tokenName,
      tokenSymbol: tokenData.tokenSymbol,
      totalTotalSupply: tokenData.tokenAmount,
      totalClaimedToken: 0,
    };

    if (tokenData.eventRegistration) {
      data.event = {
        create: {
          eventName: tokenData.eventName,
          eventDate: tokenData.eventDate,
          eventDescription: tokenData.eventDescription,
        },
      };
    }

    const tokenDetails = await prisma.tokenDetails.create({
      data,
    });

    const tokensData = Array.from({ length: tokenData.tokenAmount }).map(
      () => ({
        tokenDetailsId: tokenDetails.id,
        qrString: uuidv4(),
      })
    );

    await prisma.token.createMany({ data: tokensData });
    return tokenDetails;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}
