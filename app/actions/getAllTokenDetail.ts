"use server";
import prisma from "@/app/lib/utils";

export async function getAllTokenDetail() {
  return await prisma.tokenDetails.findMany();
}
