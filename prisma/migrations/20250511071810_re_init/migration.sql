/*
  Warnings:

  - Added the required column `solPaid` to the `TokenDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenDetails" ADD COLUMN     "allMinted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "amountPaidForMinting" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "solPaid" INTEGER NOT NULL;
