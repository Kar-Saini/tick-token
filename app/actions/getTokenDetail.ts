"use server";

import prisma from "@/app/lib/utils";

export async function getTokenDetail(id: string) {
  try {
    const token = await prisma.tokenDetails.findUnique({
      where: { id },
      include: { tokens: true },
    });
    return token;
  } catch (error) {}
}
