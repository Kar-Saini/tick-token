"use server";
import prisma from "@/app/lib/utils";
export default async function getAllClaimedUsedByTokenId(tokenId: string) {
  try {
    const claimedTokens = await prisma.token.findMany({
      where: { tokenDetailsId: tokenId },
    });
    return claimedTokens;
  } catch (err) {
    console.error("Error during token claim:", err);
    throw err;
  }
}
