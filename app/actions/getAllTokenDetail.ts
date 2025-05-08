import prisma from "@/lib/utils";

export async function getAllTokenDetail() {
  return await prisma.tokenDetails.findMany();
}
