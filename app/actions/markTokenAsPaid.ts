"use server";
import prisma from "../lib/utils";
export default async function markTokenAsPaid(
  tokenId: string,
  lamports: number
) {
  try {
    await prisma.tokenDetails.update({
      where: { id: tokenId },
      data: {
        amountPaidForMinting: true,
        lamportsPaid: lamports,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}
