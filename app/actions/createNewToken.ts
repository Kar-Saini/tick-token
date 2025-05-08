import prisma from "@/lib/utils";
import { tokenData } from "@/lib/types";
import { mintTokenToMerkleAddress } from "./mintTokenToMerkleAddress";
import { createUmiAddress } from "./createUmiAddress";
import bs58 from "bs58";

export async function createNewToken(tokenData: tokenData) {
  const tokenAddedToDB = await addToDataBase(tokenData);
  const { umi, merkleTree } = await createUmiAddress();
  await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: {
      merkleTreeAddress: merkleTree.publicKey.toString(),
      merkleTreeSecretKey: bs58.encode(merkleTree.secretKey),
    },
  });

  await mintTokenToMerkleAddress(
    tokenData.tokenAmount,
    merkleTree.publicKey.toString(),
    tokenData.address,
    tokenData.tokenName,
    umi
  );
  await prisma.tokenDetails.update({
    where: { id: tokenAddedToDB.id },
    data: { minted: true },
  });
}

async function addToDataBase(tokenData: tokenData) {
  try {
    const data: any = {
      tokenName: tokenData.tokenName,
      tokenSymbol: tokenData.tokenSymbol,
      totalSupply: tokenData.tokenAmount,
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

    return tokenDetails;
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
}
