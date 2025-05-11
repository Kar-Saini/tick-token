/*
  Warnings:

  - You are about to drop the column `solPaid` on the `TokenDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TokenDetails" DROP COLUMN "solPaid",
ADD COLUMN     "lamportsPaid" INTEGER NOT NULL DEFAULT 0;
